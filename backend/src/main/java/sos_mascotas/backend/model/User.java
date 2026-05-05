package sos_mascotas.backend.model;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor 
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nombre;

    private String telefono;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private boolean activo = true;

    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(role.name()));
    }

    @Override public String getUsername() { return email;}
    @Override public boolean isAccountNonExpired() { return true;}
    @Override public boolean isAccountNonLocked() { return true;}
    @Override public boolean isCredentialsNonExpired() { return true;}
    @Override public boolean isEnabled() { return activo;}

}
