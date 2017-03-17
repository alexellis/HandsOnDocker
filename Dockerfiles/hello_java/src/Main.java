import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {

  public static void main(String[] args) throws IOException {
    HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", 3000), 0);
    server.createContext("/", httpExchange -> {
      String response = "Hello, Docker.\n";
      httpExchange.sendResponseHeaders(200, response.length());
      OutputStream os = httpExchange.getResponseBody();
      os.write(response.getBytes());
      os.close();
    });
    server.setExecutor(null);
    System.out.println("Server running at http://0.0.0.0:3000/");
    server.start();
  }
}
