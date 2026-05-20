package sos_mascotas.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import sos_mascotas.backend.model.Role;
import sos_mascotas.backend.model.User;
import sos_mascotas.backend.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedTestUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.existsByEmail("test@gmail.com")) {
                return;
            }

            User user = new User();
            user.setEmail("test@gmail.com");
            user.setPassword(passwordEncoder.encode("Duoc1234"));
            user.setNombre("Usuario de Prueba");
            user.setTelefono("+56 9 0000 0000");
            user.setRole(Role.USER);
            userRepository.save(user);
        };
    }
}
