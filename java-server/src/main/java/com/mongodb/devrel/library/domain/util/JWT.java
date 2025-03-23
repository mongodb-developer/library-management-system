package com.mongodb.devrel.library.domain.util;

import com.mongodb.devrel.library.domain.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;


@Slf4j
public class JWT {
    @Value("${secret}")
    private static String secret = """
            En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda. El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera. Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza. Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque, por conjeturas verosímiles, se deja entender que se llamaba Quejana. Pero esto importa poco a nuestro cuento; basta que en la narración dél no se salga un punto de la verdad. Es, pues, de saber que este sobredicho hidalgo, los ratos que estaba ocioso, que eran los más del año, se daba a leer libros de caballerías, con tanta afición y gusto, que olvidó casi de todo punto el ejercicio de la caza, y aun la administración de su hacienda. Y llegó a tanto su curiosidad y desatino en esto, que vendió muchas hanegas de tierra de sembradura para comprar libros de caballerías en que leer, y así, llevó a su casa todos cuantos pudo haber dellos; y de todos, ningunos le parecían tan bien como los que compuso el famoso Feliciano de Silva, porque la claridad de su prosa y aquellas entricadas razones suyas le parecían de perlas, y más cuando llegaba a leer aquellos requiebros y cartas de desafíos, donde en muchas partes hallaba escrito: La razón de la sinrazón que a mi razón se hace, de tal manera mi razón enflaquece, que con razón me quejo de la vuestra fermosura. Y también cuando leía: ...los altos cielos que de vuestra divinidad divinamente con las estrellas os fortifican, y os hacen merecedora del merecimiento que merece la vuestra grandeza. Con estas razones perdía el pobre caballero el juicio, y desvelábase por entenderlas y desentrañarles el sentido, que no se lo sacara ni las entendiera el mesmo Aristóteles, si resucitara para sólo ello.        
    """;

    public static String fromUser(User user) {
        // Replace with actual values
        String userId = user.get_id().toString();
        String userName = user.getName();
        boolean isAdmin = true; // Replace with user.isAdmin

        // Define issued at and expiration times
        long nowMillis = System.currentTimeMillis();
        Date issuedAt = new Date(nowMillis);
        Date expiration = new Date(nowMillis + (1000L * 60 * 60 * 24 * 365)); // 1 year

        // Create the claims (payload)
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userId);
        claims.put("name", userName);
        claims.put("isAdmin", isAdmin);
        claims.put("iat", issuedAt.getTime() / 1000); // Unix timestamp

        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
        // Generate the JWT
        String jwt = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        log.debug("Generated JWT: {}", jwt);
        return jwt;
    }

    public static User toUser(String jwt) {
        User user = null;
        
        try {
            // Parse the JWT
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt);

            // Extract the claims
            Claims claims = claimsJws.getBody();

            // Extract user details
            String userId = claims.get("sub", String.class);
            String userName = claims.get("name", String.class);
            Boolean isAdmin = claims.get("isAdmin", Boolean.class);
            // Long issuedAt = claims.get("iat", Long.class);

            // Print user details
            System.out.println("User ID: " + userId);
            System.out.println("User Name: " + userName);
            System.out.println("Is Admin: " + isAdmin);
            // System.out.println("Issued At: " + issuedAt);

            user = new User(new ObjectId(userId), userName, isAdmin);

        } catch (Exception e) {
            // Handle invalid JWTs
            log.error("Invalid JWT: ()", e.getMessage());
        }

        return user;
    }

    public static User loggedInUserFromBearerAuthenticationHeader(String authorizationHeader) {
        String token = null;

        // Extract the token by removing "Bearer " prefix
        if (authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        User user = JWT.toUser(token);
        log.debug("Token: " + token);
        log.debug("Name: " + user.getName());

        return user;
    }
}

