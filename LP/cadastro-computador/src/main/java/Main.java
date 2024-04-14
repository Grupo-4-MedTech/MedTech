import Persistencia.Conexao;
import org.springframework.jdbc.core.JdbcTemplate;
import repositorio.ComputadorRepositorio;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Scanner;
import java.util.Timer;
import java.util.TimerTask;

import modelo.Computador;

public class Main {
    static Scanner leitorStr = new Scanner(System.in);
    static Conexao conexao = new Conexao();
    static JdbcTemplate conn = conexao.getConn();


    public static void main(String[] args) {
        telaInicial();
    }

    static void telaInicial() {

        System.out.println("""
                         
                         :JJJ~        !JJ?.      !JJJJJJJJJ?:     :JJJJJJJJJ7~:      !JJJJJJJJJJJ~    .?JJJJJJJJJ7.      .^7?JJJJJ?!:     .?J!       ^JJ:            \s
                         :YYYY~     .7YYYJ.      75J:.......      :YY!....:^7YY7.    ....:J57.....    :J57........      ~JY?~:..:^!?~     .J5!       ^YY:            \s
                         :YY!?Y!   .757!YJ.      75?:......       :YY!       :J57.       .J5!         :JY!.......      ~YY~               .JY7.......~YY:            \s
                         :YY^.J5! .?57 ~YJ.      7YYJJJJJJJ^      :YY!        !YJ:       .J5!         :JYYJJJJJJ?.     75?.               .JYYJJJJJJJJYY:            \s
                         :YY^ .?Y?JY!  !YJ.      75?:......       :YY!       :J57.       .J5!         :JY!.......      ~YY~               .JY7:::::::~YY:            \s
                         :YY^  .?YY!   !YJ.      75?:........     :YY!....:^!YY7.        .J5!         :J5!........      ~JY?~:...^!?^     .J5!       ^YY:            \s
                         :JJ^   .::    ~Y?.      !YJJJJJJJJJ~     :JYJJJJJJJ?~:          .?Y!         :?YJJJJJJJJ?:      .~7JJJJJJ?~:     .?Y!       ^YY:            \s
                """);
        System.out.println("""
                BEM-VINDO(A) AO NOSSO SISTEMA DE MONITORAMENTO DE COMPUTADORES!
                """);
        login(conn);
    }


    static void login(JdbcTemplate conn) {
        System.out.println("Login iniciado! \n");

        ComputadorRepositorio repositorioComputador = new ComputadorRepositorio(conn);

        List computadorAutenticado;
        do {
            System.out.println("Código do patrimônio:");
            String codPatrimonio = leitorStr.next();
            System.out.println("Senha:");
            String senhaH = leitorStr.next();

            computadorAutenticado = repositorioComputador.autenticarComputador(senhaH, codPatrimonio);

            if (computadorAutenticado.size() != 1) {
                System.out.println("Código do patrimônio ou senha incorreta. \nPor favor, tente novamente. \n");
            }

        } while (computadorAutenticado.size() != 1);

        System.out.println("""
                \n
                Login realizado com sucesso!
                Estes são os dados da conta acessada:
                \n
                """);

        Computador computador = (Computador) computadorAutenticado.get(0);
        System.out.println(computador);

        System.out.println("\nAGORA ESTE COMPUTADOR ESTÁ SENDO MONITORADO EM TEMPO REAL.");

        inserirLeituras(computador);
    }

    public static void inserirLeituras(Computador computador) {
        // SUBISTITUIR DADOS DO INSERT PELOS DADOS DA API LOOCA
        conn.execute("INSERT INTO leituraHdw (ram, disco, cpu, dataLeitura, fkComputador, fkDepartamento, fkHospital) VALUES(" + 100.0 + ", " + 100.0 + ", " + 100.0 + ", '" + LocalDateTime.now() + "', " + computador.getIdComputador() + ", " + computador.getFkDepartamento() + ", " + computador.getFkHospital() + ");");
        conn.execute("INSERT INTO leituraFerramenta (nomeApp, dtLeitura, caminho, fkComputador, fkDepartamento, fkHospital) VALUES(" + "'Chrome', '" + LocalDateTime.now() + "' , 'C:/chrome/chrome.exe'," + computador.getIdComputador() + ", " + computador.getFkDepartamento() + ", " + computador.getFkHospital() + ");");

        Timer cronometro = new Timer();

        TimerTask metodo = new TimerTask() {
            @Override
            public void run() {
                inserirLeituras(computador);
            }
        };

        //AJUSTAR INTERVALO DE INSERÇÃO DE DADOS
        cronometro.schedule(metodo, 5000);
    }
}