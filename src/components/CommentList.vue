<template>
  <div class="comment-list">
    <h3 class="comment-title">
      <span>评论</span>
      <span class="comment-number">{{ commentList.length }}</span>
    </h3>
    <div class="send-comment">
      <el-image
        v-if="userAvatarSrc"
        class="comment-avatar"
        :src="userAvatarSrc"
        fit="cover"
        :preview-src-list="[userAvatarSrc]"
        hide-on-click-modal
      />
      <el-avatar v-else class="comment-avatar">{{ userInfo.nickname?.slice(0, 2) }}</el-avatar>
      <el-input
        v-model="form.message"
        class="comment-input"
        type="textarea"
        :maxlength="500"
        show-word-limit
        placeholder="发一条友善的评论"
      />
      <el-button
        class="send-button"
        type="primary"
        :loading="btnLoading"
        @click="sendComment"
      >
        发布
      </el-button>
    </div>
    <div v-for="item in commentList" class="comment-item">
      <el-image
        v-if="commentAvatarSrc(item)"
        class="comment-avatar"
        :src="commentAvatarSrc(item)"
        fit="cover"
        :preview-src-list="[commentAvatarSrc(item)]"
        hide-on-click-modal
      />
      <el-avatar v-else class="comment-avatar">{{ item.user.nickname?.slice(0, 2) }}</el-avatar>
      <div class="comment-info">
        <p class="nickname">{{ item.user.nickname }}</p>
        <p class="comment">{{ item.message }}</p>
        <p class="time">{{ formatTime(item.createDate) }}</p>
        <el-popconfirm v-if="item.user.id === userInfo.id" title="是否确认删除？" @confirm="deleteComment(item)">
          <template #reference>
            <el-button class="comment-delete" link :loading="btnLoading">删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div v-if="!commentList.length" class="comment-empty">
      <span>暂无评论</span>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'CommentList',
    props: ['cardId'],
    data() {
      return {
        btnLoading: false,
        form: {
          message: '',
        },
        commentList: [],
      };
    },
    methods: {
      getCommentList() {
        if (this.cardId) {
          this.axios({
            method: 'get',
            url: '/comment/list',
            params: {
              cardId: this.cardId,
            },
          }).then(res => {
            this.commentList = res.data;
          });
        }
      },
      sendComment() {
        if (!this.form.message.trim()) {
          this.$message.error('请输入评论');
          return;
        }
        this.btnLoading = true;
        this.axios({
          method: 'post',
          url: '/comment',
          data: {
            cardId: this.cardId,
            message: this.form.message,
          },
        }).then(() => {
          this.$message.success('发布成功');
          this.form.message = '';
          this.getCommentList();
        }).finally(() => {
          this.btnLoading = false;
        });
      },
      deleteComment(item) {
        this.btnLoading = true;
        this.axios({
          method: 'delete',
          url: '/comment/' + item.id,
        }).then(() => {
          this.$message.success('删除成功');
          this.getCommentList();
        }).finally(() => {
          this.btnLoading = false;
        });
      },
      commentAvatarSrc(item) {
        if (item.user.avatar) {
          return `${this.baseImage}/${item.user.avatar}`;
        }
        return '';
      },
    },
    computed: {
      ...mapState(['userInfo', 'isAdmin', 'isMember', 'staticURL']),
      baseImage() {
        return `${this.staticURL}/tools/image`;
      },
      userAvatarSrc() {
        if (this.userInfo.avatar) {
          return `${this.baseImage}/${this.userInfo.avatar}`;
        }
        return '';
      },
    },
    watch: {
      cardId: {
        handler() {
          this.form.message = '';
          this.commentList = [];
          this.getCommentList();
        },
        immediate: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .comment-list {
    .comment-title {
      margin: 0;

      .comment-number {
        margin-left: 5px;
        font-size: 14px;
        font-weight: normal;
        color: var(--normal-color);
      }
    }

    .send-comment {
      display: flex;
      margin-top: 10px;

      .comment-input {
        margin-left: 10px;
        flex-shrink: 1;
      }

      .send-button {
        margin-left: 10px;
        flex-shrink: 0;
      }
    }

    .comment-item {
      display: flex;
      margin-top: 10px;
      position: relative;

      .comment-info {
        margin-left: 10px;

        .nickname {
          margin: 0;
          color: var(--normal-color);
        }

        .comment {
          margin: 5px 0 0;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .time {
          margin: 5px 0 0;
          color: var(--info-color);
        }

        .comment-delete {
          position: absolute;
          right: 0;
          bottom: 0;
          visibility: hidden;
        }
      }

      &:hover {
        .comment-delete {
          visibility: visible;
        }
      }
    }

    .comment-avatar {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .comment-empty {
      margin-top: 20px;
      text-align: center;
      color: var(--info-color);
    }
  }
</style>
