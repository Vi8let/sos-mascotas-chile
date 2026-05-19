package sos_mascotas.report_service.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoReporte tipo;

    @Enumerated(EnumType.STRING)
    private EstadoReporte estado = EstadoReporte.ACTIVO;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String ubicacion;
    private String imagenUrl;
    private String contacto;

    private Long autorId;

    @CreationTimestamp
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    private LocalDateTime actualizadoEn;
}
