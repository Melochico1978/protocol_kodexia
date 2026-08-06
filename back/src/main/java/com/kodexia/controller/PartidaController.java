package com.kodexia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:4200}", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequestMapping("/partida_pvp")
public class PartidaController {

    // Simple in-memory state for a single global PvP match
    private Map<String, Object> partidaState = new HashMap<>();

    @GetMapping
    public ResponseEntity<Map<String, Object>> getPartida() {
        return ResponseEntity.ok(partidaState);
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updatePartida(@RequestBody Map<String, Object> state) {
        this.partidaState = state;
        return ResponseEntity.ok(this.partidaState);
    }
}
