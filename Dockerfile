# 1. React 애플리케이션 빌드
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=optional  #fsevents를 무시하기 위한 설정 추가
COPY . .
RUN npm run build

# 2. Nginx를 사용하여 React 정적 파일 서빙
FROM nginx:latest
EXPOSE 80
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

# Nginx를 포그라운드 모드로 실행
CMD ["nginx", "-g", "daemon off;"]