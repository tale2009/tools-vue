<template>
  <div v-loading="loading" class="home-container">
    <AccountPage>
      <div class="user-info">
        <el-upload
          action="/"
          :show-file-list="false"
          accept="image/*"
          :before-upload="beforeUpload"
        >
          <el-avatar class="user-avatar" :size="100" :src="avatarSrc">{{ userInfo.nickname?.slice(0, 2) }}</el-avatar>
        </el-upload>
        <div class="user-other">
          <p class="nickname">{{ userInfo.nickname }}</p>
          <MemberTag />
          <p v-if="isMember" class="expire-date">
            有效期至：{{ userInfo.member?.type === 'permanent' ? '永久' : formatTime(userInfo.member.expireDate) }}
          </p>
        </div>
      </div>

      <CropperDialog
        v-model="cropperDialog"
        :image="cropperImage"
        :aspect-ratio="1"
        low-quality
        @get-data="updateAvatar"
      />
    </AccountPage>
  </div>
</template>

<script>
  import AccountPage from '@/render/components/page/AccountPage';
  import MemberTag from '@/render/components/MemberTag';
  import CropperDialog from '@/render/components/dialog/CropperDialog';
  import { mapActions, mapState } from 'vuex';
  import loadImage from 'blueimp-load-image';
  import { getImageFileSize } from '@/render/utils';

  export default {
    name: 'Home',
    components: {
      AccountPage,
      MemberTag,
      CropperDialog,
    },
    data() {
      return {
        loading: false,
        cropperImage: '',
        cropperDialog: false,
      };
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      ...mapActions(['getUserInfo']),
      async beforeUpload(file) {
        let flag = file.type.includes('image');
        if (flag) {
          const { width, height } = await getImageFileSize(file);
          loadImage(file, {
            maxWidth: height >= width ? 600 : 0,
            maxHeight: width >= height ? 600 : 0,
            canvas: true,
          }).then(data => {
            this.cropperImage = data.image.toDataURL('image/png', 1);
            this.cropperDialog = true;
          });
        } else {
          this.$message.warning('请选择正确图片格式');
        }
        return false;
      },
      updateAvatar(image) {
        const file = this.dataURLtoFile(image, 'avatar');
        const formData = new FormData();
        formData.append('file', file);
        this.axios({
          method: 'put',
          url: '/profile/avatar',
          data: formData,
        }).then(() => {
          this.$message.success('上传成功');
          this.getUserInfo();
        });
      },
    },
    computed: {
      ...mapState(['userInfo', 'staticURL', 'isAdmin', 'isMember']),
      baseImage() {
        return `${this.staticURL}/tools/image`;
      },
      avatarSrc() {
        if (this.userInfo.avatar) {
          return `${this.baseImage}/${this.userInfo.avatar}`;
        }
        return '';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .home-container {
    .user-info {
      display: flex;

      .user-avatar {
        position: relative;
        flex-shrink: 0;
        margin-right: 20px;
        user-select: none;
        cursor: pointer;
        font-size: 28px;

        &:hover:after {
          display: flex;
          justify-content: center;
          align-items: center;
          content: '更换头像';
          font-size: 14px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
        }
      }

      .user-other {
        flex-grow: 1;

        .nickname {
          margin: 0;
          line-height: 1.7;
          font-size: 18px;
          font-weight: bold;
          color: var(--main-color);
        }

        .member-tag {
          margin-top: 5px;
        }

        .expire-date {
          line-height: 1.7;
          margin: 5px 0 0;
          font-size: 12px;
          color: var(--info-color);
        }
      }
    }
  }
</style>
