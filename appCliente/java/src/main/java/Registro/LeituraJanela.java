package Registro;

import com.github.britooo.looca.api.group.janelas.Janela;
import com.github.britooo.looca.api.group.janelas.JanelaGrupo;
import modelo.Computador;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.json.JSONObject;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import Comunicacao.Slack;

public class LeituraJanela extends Leitura{
    private List<Janela> listaGuias;

    private List<String> redesSociais;
    // constructor

    public LeituraJanela(Computador computador) throws IOException, InterruptedException {
        super(computador);
        this.listaGuias = new ArrayList<>();
        this.redesSociais = new ArrayList<>();
        this.redesSociais.add("Google Chrome");
        this.redesSociais.add("X");
        this.redesSociais.add("Firefox");
        this.redesSociais.add("Opera");
        realizarLeitura();
    }

    // outros métodos
    public void realizarLeitura() throws IOException, InterruptedException {
        JanelaGrupo janelaGrupo = looca.getGrupoDeJanelas();
        List<Janela> listaJanelas = janelaGrupo.getJanelas();
        for (Janela listaJanela : listaJanelas) {
            if (listaJanela.getTitulo().contains("Google Chrome") || listaJanela.getTitulo().contains("Google Chrome") || listaJanela.getTitulo().contains("Firefox") || listaJanela.getTitulo().contains("Opera")) {
                //FAZER OUTRO FOR VERIFICANDO SE O NOME DA JANELA CONTÉM UMA DAS STRINGS EXISTENTES NA LISTA
                for (String redeSocial : this.redesSociais) {
//                    System.out.println(listaJanela.getTitulo());
                    if(listaJanela.getTitulo().toUpperCase().contains(redeSocial.toUpperCase())){
                        JSONObject json = new JSONObject();
                        json.put("text","\uD83D\uDEA8" + "o computador acessou " +getComputador().getNome() + " acessou a guia " + redeSocial +  "\n" + "INFORMAÇÕES DO COMPUTADOR: \n"+ getComputador());
                        Slack.enviarMensagem(json);
                    }
                }
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
