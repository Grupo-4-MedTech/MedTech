package repositorio;

import modelo.Hospital;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.List;

public class HospitalRepositorio {
    
    final JdbcTemplate conn;// simulando conexão com BD
    
    public HospitalRepositorio(JdbcTemplate conn)
    {
        this.conn = conn;
    };

    public Hospital buscarHospitalPorId(int id){
        return conn.queryForObject("SELECT * FROM hospital WHERE idHospital = ?;", new BeanPropertyRowMapper<>(Hospital.class), id);
    }
}
