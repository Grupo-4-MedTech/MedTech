import modelo.Computador;
import modelo.Departamento;
import modelo.Hospital;
import repositorio.ComputadorRepositorio;
import repositorio.DepartamentoRepositorio;
import repositorio.HospitalRepositorio;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    static Scanner leitorStr = new Scanner(System.in);
    static Scanner leitorNum = new Scanner(System.in);
    
    public static void main(String[] args) {
        // INÍCIO MOCKANDO DADOS

        List<Hospital> listaHosp = new ArrayList<>();
        listaHosp.add(new Hospital(1, "Clínica Flores de Primavera", "Gouveia Santana", "0234567800190", "primavera6773"));
        listaHosp.add(new Hospital(1, "Clínica Folhas de Outono", "Teixeira Gazzoli", "0000000000000", "gazzoli"));

        List<Departamento> listaDep = new ArrayList<>();
        listaDep.add(new Departamento(149, "Guichê", 1000, listaHosp.get(0)));
        listaDep.add(new Departamento(147, "Triagem", 1001, listaHosp.get(0)));
        listaDep.add(new Departamento(145, "Consultótio", 1002, listaHosp.get(0)));
        listaDep.add(new Departamento(150, "Farmácia", 1050, listaHosp.get(0)));

        listaDep.add(new Departamento(130, "Guichê", 1000, listaHosp.get(1)));
        listaDep.add(new Departamento(100, "Triagem", 1001, listaHosp.get(1)));
        listaDep.add(new Departamento(209, "Consultótio", 1002, listaHosp.get(1)));
        listaDep.add(new Departamento(183, "Farmácia", 1050, listaHosp.get(1)));

        List<Computador> listaComp = new ArrayList<>();
        listaComp.add(new Computador("Computador da recepção", "C0578921", 1000, 1000, 1000, "sptech88", listaDep.get(0)));
        listaComp.add(new Computador("Computador da farmácia", "C0578920", 1000, 1000, 1000, "medtech777", listaDep.get(7)));

        //Gerando listas de dados mockados
        for(int i = 0; i < listaHosp.size(); i++){
            Hospital.atualizarLista(listaHosp.get(i));
        }

        for(int i = 0; i < listaDep.size(); i++){
            Departamento.atualizarLista(listaDep.get(i));
        }

        for (int i = 0; i < listaComp.size(); i++){
            Computador.atualizarLista(listaComp.get(i));
        }
        // FIM MOCKANDO DADOS

        System.out.println("""
                              :!77777777!:             \s
                              ?J::::::::J?             \s
                              J?        7?             \s
                              J?        ..             \s
                      ....    J?    ..............     \s
                    ^?777!    J?    ^~~~~~~~~~~~~~!:   \s
                    ?J        J?                  !~   \s
                    ??        !!        ..        ~~   \s
                    ??                  ~!        ~~   \s
                    7J~^^^^^^^^^^^^^    ~!    ::::!^   \s
                    .^~~~~~~~~~~~~~~.   ~!    :^^^:    \s
                                        ~!             \s
                              ^^        ~!             \s
                              !~        ~!             \s
                              ^!~^^^^^^~!^             \s
                                ........  \s
                """);
        System.out.println("""
        BEM-VINDO(A) AO NOSSO SISTEMA DE MONITORAMENTO DE COMPUTADORES!
        
        1 - Cadastro
        2 - Login
        
        Antes de começarmos, digite o número do processo que deseja realizar:
        """);

        int processo;
        do {
            processo = leitorStr.nextInt();
             if(processo > 2 || processo < 1){
                 System.out.println("Digite um número válido.");
             } else {
                 break;
             }
        }while (true);

        if(processo == 2){
            login();
        } else{
            cadastro();
        }
    }

    static void login()
    {
        System.out.println("Login iniciado! \n");

        ComputadorRepositorio repositorioComputador = new ComputadorRepositorio(true);

        List computadorAutenticado;
        do{
            System.out.println("Código do patrimônio:");
            String codPatrimonio = leitorStr.next();
            System.out.println("Senha:");
            String senhaH = leitorStr.next();

            computadorAutenticado = repositorioComputador.autenticarComputador(senhaH, codPatrimonio);

            if(computadorAutenticado.size() != 1){
                System.out.println("Código do patrimônio ou senha incorreta. \n Por favor, tente novamente. \n");
            }

        } while(computadorAutenticado.size() != 1);

        System.out.println("""
                \n
                Login realizado com sucesso!
                Estes são os dados da conta acessada:
                \n
                """);

        System.out.println(computadorAutenticado.get(0));

    }

    static void cadastro() {

        System.out.println("""
                Cadastro selecionado com sucesso!
                Insira as informações do hospital/clínica que o computador atual pertence.
                """);

        // INÍCIO SELEÇÃO HOSPITAL

        HospitalRepositorio repositorioHospital = new HospitalRepositorio(true);

        List hospitalAutenticado;

        do{
            System.out.println("CNPJ (apenas números):");
            String cnpj = leitorStr.next();
            System.out.println("Senha:");
            String senhaH = leitorStr.next();

            hospitalAutenticado = repositorioHospital.autenticarHospital(senhaH, cnpj);

            if(hospitalAutenticado.size() != 1){
                System.out.println("CNPJ ou senha incorreta. \n Por favor, tente novamente.");
            }

            } while(hospitalAutenticado.size() != 1);

        //FIM SELEÇÃO HOSPITAL
        //INÍCIO SELEÇÃO DEPARTAMENTO

        System.out.println("\nAgora, selecione o departamento que este computador pertence \n");

        DepartamentoRepositorio repositorioDepartamento = new DepartamentoRepositorio(true);

        List<Departamento> departamentosDoHospital = repositorioDepartamento.listarDepartamentosPorHospital((Hospital) hospitalAutenticado.get(0));

        for(int i = 0; i < departamentosDoHospital.size(); i++){
            Departamento departamento = departamentosDoHospital.get(i);
            System.out.println("Identificador: " + departamento.getIdDepartamento() + " - " + departamento.getNome());
        }

        System.out.println("\nDigite o número identificador do departamento que o computador atual pertence:");

        int numDep;
        boolean depValido = false;
        Departamento departamentoSelecionado = null;

        do{
            numDep = leitorNum.nextInt();

            for(int i = 0; i < departamentosDoHospital.size(); i++){
                if(departamentosDoHospital.get(i).getIdDepartamento() == numDep){
                    departamentoSelecionado = departamentosDoHospital.get(i);
                    depValido = true;
                    break;
                }
            }
            if(depValido){
                break;
            }
            System.out.println("Digite um número de departamento válido.");
        }while(true);

        System.out.println("\nDepartamento selecionado: " + departamentoSelecionado.getIdDepartamento() + " - " + departamentoSelecionado.getNome());

        //FIM SELEÇÃO DEPARTAMENTO
        //INÍCIO PREENCHIMENTO DE DADOS DO COMPUTADOR

        System.out.println("""
                \n
                Insira algumas informações sobre o computador.
                Nome:
                """);
        String nomeComputador = leitorStr.next();

        System.out.println("Código do patrimônio:");
        String codPatrimonio = leitorStr.next();

        System.out.println("Capacidade máxima da CPU:");
        double maxCpu = leitorNum.nextDouble();

        System.out.println("Capacidade máxima da RAM:");
        double maxRam = leitorNum.nextDouble();

        System.out.println("Capacidade máxima do disco:");
        double maxDisco = leitorNum.nextDouble();

        System.out.println("Crie uma senha de acesso:");
        String senha = leitorStr.next();

        Computador computador = new Computador(nomeComputador, codPatrimonio, maxCpu, maxRam, maxDisco, senha, departamentoSelecionado);
        Computador.atualizarLista(computador);

        System.out.println("""
                \n
                COMPUTADOR CADASTRADO COM SUCESSO!
                Redirecionando para o login...
                """);

        login();
        }
    }
