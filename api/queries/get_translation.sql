SELECT 
    term.name AS object,
    term.type AS category,
    definition.meaning as meaning
FROM 
    term
INNER JOIN translation ON translation.term = term.term
LEFT JOIN definition ON definition.translation = translation.translation
INNER JOIN language ON translation.language = language.language
INNER JOIN synonym ON synonym.translation = translation.translation
INNER JOIN word ON synonym.word = word.word
WHERE
    term.name = 'ngai';