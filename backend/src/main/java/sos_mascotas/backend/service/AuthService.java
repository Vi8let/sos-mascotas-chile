package sos_mascotas.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sos_mascotas.backend.DTO.AuthResponse;
import sos_mascotas.backend.DTO.LoginRequest;
import sos_mascotas.backend.DTO.RegisterRequest;
import sos_mascotas.backend.DTO.UserInfoResponse;
import sos_mascotas.backend.model.Role;
import sos_mascotas.backend.model.User;
import sos_mascotas.backend.repository.UserRepository;
import sos_mascotas.backend.config.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authmanager;


    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email()))
            throw new IllegalArgumentException("email ya registrado");
        
        User user = new User();
        user.setEmail(req.email());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setNombre(req.nombre());
        user.setTelefono(req.telefono());
        user.setRole(Role.USER);
        userRepository.save(user);

        return new AuthResponse(jwtUtil.generate(user), user.getEmail(), user.getRole().name());

        
    }

    public AuthResponse login(LoginRequest req) {
        authmanager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        User user = userRepository.findByEmail(req.email()).orElseThrow(() -> new IllegalArgumentException("usuario no encontrado"));
        return new AuthResponse(jwtUtil.generate(user), user.getEmail(), user.getRole().name());
    }

    public UserInfoResponse validateToken(String bearToken) throws IllegalArgumentException{
        String token = bearToken.replace("Bearer", "").trim();
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("usuario no encontrado"));
        
        if (!jwtUtil.isValid(token, user))
            throw new SecurityException("Token invalido o expirado");

        return new UserInfoResponse(user.getId(), user.getEmail(), user.getNombre(), user.getRole());
        
    }

}
