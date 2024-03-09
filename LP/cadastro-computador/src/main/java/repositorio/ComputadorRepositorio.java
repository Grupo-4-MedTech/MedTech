package repositorio;

import modelo.Computador;

import java.util.ArrayList;
import java.util.List;

public class ComputadorRepositorio {

    final boolean connection; //Simulando conexão de BD

    public ComputadorRepositorio(boolean connection)
    {
        this.connection = connection;
    }

    public List<Computador> autenticarComputador(String senha, String codPatrimonio){

        List<Computador> listaComputadores = Computador.getListaComputadores();

        List<Computador> computadorEncontrado = new ArrayList<>();

        for(int i = 0; i < listaComputadores.size(); i++){
           Computador computador = listaComputadores.get(i);
            if(
                computador.getCodPatrimonio().equals(codPatrimonio) &&
                computador.getSenha().equals(senha)
            ){
                computadorEncontrado.add(computador);
                return computadorEncontrado;
            }
        }

        return computadorEncontrado;
    }

}
