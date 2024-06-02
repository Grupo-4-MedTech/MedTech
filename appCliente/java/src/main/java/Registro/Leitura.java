package Registro;

import Persistencia.Conexao;
import com.github.britooo.looca.api.core.Looca;
import com.github.britooo.looca.api.group.memoria.Memoria;
import org.springframework.jdbc.core.JdbcTemplate;

public abstract class Leitura {
    private int fkComputador;

    protected Looca looca = new Looca();
    static Conexao conexao = new Conexao();
    static JdbcTemplate conn = conexao.getConn();

    // constructor

    public Leitura(int fkComputador) {
        this.fkComputador = fkComputador;
    }

    // outros métodos

    public abstract void inserirLeitura() throws InterruptedException;
    public abstract  void realizarLeitura();

    // getter
    public int getFkComputador() {
        return fkComputador;
    }
}
