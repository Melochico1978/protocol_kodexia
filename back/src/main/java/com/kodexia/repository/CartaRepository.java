package com.kodexia.repository;

import com.kodexia.model.CartaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartaRepository extends JpaRepository<CartaEntity, String> {
}
