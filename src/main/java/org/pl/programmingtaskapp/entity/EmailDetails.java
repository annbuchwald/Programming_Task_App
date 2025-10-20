package org.pl.programmingtaskapp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailDetails {
    private String recipient;
    private String msgBody;
    private String subject;
}
