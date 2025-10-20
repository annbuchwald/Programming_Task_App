package org.pl.programmingtaskapp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique=true)
    private String username;

    @Indexed(unique=true)
    private String email;

    private String password;

    private String roles;

    @Field("email_confirmed")
    private boolean emailConfirmed;

    @Field("email_confirmation_code")
    private String emailConfirmationCode;
}
