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
    word: string;
}