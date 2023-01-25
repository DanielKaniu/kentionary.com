SELECT 
                result.term,
                result.category,
                JSON_OBJECTAGG(result.language, result.translation) as translation
            FROM(
                SELECT 
                    term.name as term, 
                    language.name as language, 
                    term.type as category,
                    JSON_ARRAYAGG(word.name) as translation
                FROM language
                INNER JOIN translation on translation.language = language.language
                INNER JOIN term on translation.term = term.term
                INNER JOIN synonym on synonym.translation = translation.translation
                INNER JOIN word on synonym.word = word.word
                INNER JOIN (
                    SELECT word.name, term.term
                    FROM word
                    INNER JOIN synonym on synonym.word = word.word
                    INNER JOIN translation on synonym.translation = translation.translation
                    INNER JOIN term on translation.term = term.term
                    WHERE word.name = '$word'
                ) AS search ON search.term = term.term
                GROUP BY term.name, language.name, term.type
            ) as result
            GROUP BY result.term, result.category