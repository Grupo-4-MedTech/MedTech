package log;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class LogManager {

    public static void salvarLog(Log log, int id) {

        try (BufferedWriter bw = new BufferedWriter(new FileWriter("logs.txt", true))) {
            //Implementa um id Ficticio
            bw.write("ID %d. ".formatted(id));
            bw.newLine();

            //Escreve o dado que será gravado no log
            bw.write(log.toString());
            bw.newLine();

            bw.newLine();
            bw.write("----------------------------------------");
            bw.newLine();
        } catch (IOException e) {
            System.out.print("Erro: " + e.getMessage());
        }
    }
}
