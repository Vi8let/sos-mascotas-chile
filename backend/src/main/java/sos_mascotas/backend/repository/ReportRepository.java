package sos_mascotas.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sos_mascotas.backend.model.EstadoReporte;
import sos_mascotas.backend.model.Report;
import sos_mascotas.backend.model.TipoReporte;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByTipo(TipoReporte tipo);

    List<Report> findByEstado(EstadoReporte estado);

    List<Report> findByAutorId(Long autorId);

    @Query("SELECT r FROM Report r WHERE "
            + "LOWER(r.titulo)      LIKE LOWER(CONCAT('%', :q, '%')) OR "
            + "LOWER(r.descripcion) LIKE LOWER(CONCAT('%', :q, '%')) OR "
            + "LOWER(r.ubicacion)   LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Report> search(@Param("q") String q);
}
