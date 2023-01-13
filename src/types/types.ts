//
//The list of languages.
export interface Language {
    success: boolean;
    data: {
        language: number;
        name: string;
    }
}
//
//The category of a word.
export interface Category{
    success: boolean;
    data: {
        category: string;
    }
}
//
//The object/term for which to add a translation.
export interface Term{
    success: boolean;
    data: {
        object: string;
        category: string;
    }
}
//
//The nature of the words that are to be used to search for terms.
export interface Word_for_term {
    word: string | null;
    language: string | null;
}
//
//The term the user creates when s/he doesn't find a term of choice.
export interface New_term{
    term: string | null;
    category: string | null;
}
//
//The translations to save in the database.
export interface Word_to_save{
    word_from: {
        language: string | null;
        word: string | null;
        meaning: string | null;
        sentence?: string | null;
    };
    word_to: {
        language: string | null;
        word: string | null;
        meaning: string | null;
        sentence?: string | null;
    }
    synonym: {
        language: string | null;
        word: string | null;
        meaning: string | null;
        sentence?: string | null;
    }
}
//
//The structure the results from the database.
export interface Check {
    success: boolean;
    data: {
        result: string;
    }
}
//
//The results after successfully saving a translation.
export interface Save_result{
    success: boolean;
}