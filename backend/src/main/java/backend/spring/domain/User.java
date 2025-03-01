package backend.spring.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "users")
@Getter //게터로 getId, getTitle, getContent 사용 가능
@NoArgsConstructor(access = AccessLevel.PROTECTED)//producted타입으로 기본생성자
public class User {

    @Id //기본키로 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT 방식 사용
    @Column(name = "id", nullable = false)
    private Long id; //게시물 일련번호

    @Column(name = "username", nullable = false)
    private String username; //게시물 제목

    @Column(name = "email", nullable = false)
    private String email; //게시물 내용

    @Builder
    public User(String username, String email) {  //빌더 패턴으로 객체 생성
        this.username = username;
        this.email = email;
    }

}