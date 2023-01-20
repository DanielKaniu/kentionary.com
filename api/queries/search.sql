WITH
	main AS(
        SELECT 
            term.name as term, 
            language.name as language, 
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
            WHERE word.name = 'Ngai'
        ) AS search ON search.term = term.term
        -- ORDER BY term ASC
        GROUP BY term.name, language.name
    ),
	terms AS (
    	SELECT word.name, term.term
        FROM word
        INNER JOIN synonym on synonym.word = word.word
        INNER JOIN translation on synonym.translation = translation.translation
        INNER JOIN term on translation.term = term.term
        WHERE word.name = 'house'
    ),
    result AS (
        SELECT main.term, JSON_OBJECTAGG(main.language, main.translation)
        FROM main
        GROUP BY main.term
    )
SELECT result.* from result;