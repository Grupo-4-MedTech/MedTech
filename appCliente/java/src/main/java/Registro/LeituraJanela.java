package Registro;

import com.github.britooo.looca.api.group.janelas.Janela;
import com.github.britooo.looca.api.group.janelas.JanelaGrupo;
import modelo.Computador;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class LeituraJanela extends Leitura{
    private List<Janela> listaGuias;


    // constructor

    public LeituraJanela(Computador computador) {
        super(computador);
        this.listaGuias = new ArrayList<>();
        realizarLeitura();
    }

    // outros métodos
    public void realizarLeitura(){
        JanelaGrupo janelaGrupo = looca.getGrupoDeJanelas();
        List<Janela> listaJanelas = janelaGrupo.getJanelas();
        for (Janela listaJanela : listaJanelas) {
            if (listaJanela.getTitulo().contains("Google Chrome") || listaJanela.getTitulo().contains("Edge") || listaJanela.getTitulo().contains("Firefox") || listaJanela.getTitulo().contains("Opera")) {
                listaGuias.add(listaJanela);
            }
        }
        this.inserirLeitura();
    }

    @Override
    public void inserirLeitura() {
        for (Janela janela : this.listaGuias) {
            String queryFerramenta =
                    "INSERT INTO leituraFerramenta (nomeApp, caminho, fkComputador, fkDepartamento, fkHospital) VALUES( '"
                            + janela.getTitulo() + "', '"
                            + janela.getComando() + "', "
                            + super.getComputador().getIdComputador() + ", "
                            + super.getComputador().getFkDepartamento() + ", "
                            + super.getComputador().getFkHospital() + "); ";

            System.out.printf("""
                        COMANDO DE INSERÇÃO DE LEITURAS DE FERRAMENTAS EM USO: \n
                        %s \n
                        """, queryFerramenta);
            executarQuery(conn, queryFerramenta, LeituraJanela.class);
            executarQuery(connSQL, queryFerramenta, LeituraJanela.class);
        }
    }
}
