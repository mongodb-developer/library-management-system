/**
 * Author model as returned by the API.
 */
export interface Author {
    name: string;
    sanitizedName: string;
    aliases: Array<string>;
    bio: string;
    
    /**
     * Array of books written by this author.
     */
    books: Array<{
        title: string;
        isbn: string;
        cover: string;
    }>;
}
