package repositorio;

import modelo.Computador;
import java.util.List;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class ComputadorRepositorio {

    final JdbcTemplate conn;

    public ComputadorRepositorio(JdbcTemplate conn)
    {
        this.conn = conn;
    }

    public List<Computador> autenticarComputador(String senha, String codPatrimonio){
        DepartamentoRepositorio departamentoRepositorio = new DepartamentoRepositorio(this.conn);
        List<Computador> computadorEncontrado = conn.query("""
                SELECT
                c.idComputador,
                c.nome,
                c.modeloProcessador,
                c.codPatrimonio,
                c.gbRam as maxRam,
                c.gbDisco as maxDisco,
                c.fkDepartamento,
                c.fkHospital
                FROM computador c
                WHERE senha = ?
                AND codPatrimonio = ?;
                """, new BeanPropertyRowMapper<>(Computador.class), senha, codPatrimonio);

        computadorEncontrado.get(0).setDepartamento(departamentoRepositorio.buscarDepartamentoPorId(computadorEncontrado.get(0).getFkDepartamento()));
        return computadorEncontrado;
    }

}
