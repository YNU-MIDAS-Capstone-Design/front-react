package backend.spring.service;

import backend.spring.domain.User;
import backend.spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service  //빈으로 등록
public class UserService {
    private final UserRepository userRepository;

    public void save() {
        User user = new User("eunseo", "es.naver.com");
        userRepository.save(user);
    }
}
