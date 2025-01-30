// webpack 5버전 이상일 경우 이미지는 객체로 변환될 수 있기 때문에 import사용

import kkoImgUrl from '~/assets/kakaoLogo.png';
import gglImgUrl from '~/assets/web_neutral_sq_na@4x.png';
export default {
  namespaced: true,
  state: () => ({
    kkoImg: kkoImgUrl,
    gglImg: gglImgUrl
  })
}