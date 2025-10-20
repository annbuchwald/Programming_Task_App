db = db.getSiblingDB('mongo_db');

db.createCollection('users');

const users = [
    {
        id: 1,
        username: "admin",
        email: "admin@gmail.com",
        password: "$2a$10$kPHRvJeSD1s0TFqMmgFTFeR/C8laQmF0MoXj1La15T31T2naD2fz.",
        roles: "USER",
        email_confirmed: true
    },
    {
        id: 2,
        username: "user",
        email: "user@gmail.com",
        password: "$2a$10$kPHRvJeSD1s0TFqMmgFTFeR/C8laQmF0MoXj1La15T31T2naD2fz.",
        roles: "ADMIN",
        email_confirmed: true
    },
];

users.forEach(user => {
    db.users.updateOne(
        { id: user.id },
        { $set: user },
        { upsert: true }
    );
});

db.createCollection('programming_tasks');

db.programming_tasks.insertMany([
    {
        title: "Suma elementow tablicy",
        description: "Utworz funkcje, ktora oblicza sume wszystkich elementow w tablicy liczb calkowitych. Funkcja powinna obslugiwac zarowno liczby dodatnie, jak i ujemne.",
        testCases: [
            {
                input: "1 2 3 4",
                expectedOutput: "10",
                description: "Test z liczbami dodatnimi"
            },
            {
                input: "-1 -2 -3 -4",
                expectedOutput: "-10",
                description: "Test z liczbami ujemnymi"
            },
            {
                input: "",
                expectedOutput: "0",
                description: "Pusta tablica (brak liczb)"
            },
            {
                input: "0 0 0 0",
                expectedOutput: "0",
                description: "Tablica zawierajaca same zera"
            },
            {
                input: "-5 5 -10 10",
                expectedOutput: "0",
                description: "Liczby dodatnie i ujemne, ktore sie znosza"
            },
            {
                input: "1000000 2000000 3000000",
                expectedOutput: "6000000",
                description: "Duze liczby"
            }
        ]
    },
    {
        title: "Sprawdzenie palindromu",
        description: "Napisz funkcje, ktora sprawdza, czy podany ciag znakow jest palindromem. Funkcja powinna ignorowac spacje, znaki interpunkcyjne oraz wielkosc liter.",
        testCases: [
            {
                input: "racecar",
                expectedOutput: "true",
                description: "Prosty test palindromu"
            },
            {
                input: "hello",
                expectedOutput: "false",
                description: "Test niebedacy palindromem"
            },
            {
                input: "A man a plan a canal Panama",
                expectedOutput: "true",
                description: "Zlozony palindrom z wieloma spacjami"
            },
            {
                input: "No lemon, no melon",
                expectedOutput: "true",
                description: "Palindrom z przecinkiem"
            },
            {
                input: "Was it a car or a cat I saw?",
                expectedOutput: "true",
                description: "Palindrom z pytajnikiem"
            },
            {
                input: "12321",
                expectedOutput: "true",
                description: "Palindrom numeryczny"
            },
            {
                input: "1a2",
                expectedOutput: "false",
                description: "Niepalindromowy ciag mieszany"
            }
        ]
    },
    {
        title: "Znajdz brakujaca liczbe",
        description: "Dla danej tablicy zawierajacej n unikalnych liczb z zakresu od 0 do n, znajdz brakujaca liczbe w sekwencji.",
        testCases: [
            {
                input: "0 1 3",
                expectedOutput: "2",
                description: "Podstawowy przypadek testowy"
            },
            {
                input: "9 6 4 2 3 5 7 0 1",
                expectedOutput: "8",
                description: "Test z wieksza sekwencja"
            },
            {
                input: "0",
                expectedOutput: "1",
                description: "Brakujaca liczba to 1 (dla pojedynczego 0)"
            },
            {
                input: "1",
                expectedOutput: "0",
                description: "Brakujaca liczba to 0 (dla pojedynczego 1)"
            },
            {
                input: "0 1 2 3 4 5 6 7 9",
                expectedOutput: "8",
                description: "Brakuje liczby w srodku duzej sekwencji"
            },
            {
                input: "1 2 3 4 5 6 7 8 9 10",
                expectedOutput: "0",
                description: "Brakujaca liczba to 0 (skrajny przypadek)"
            },
            {
                input: "0 2",
                expectedOutput: "1",
                description: "Minimalna sekwencja z brakujaca liczba"
            }
        ]
    },
    {
        title: "Obroc tablice",
        description: "Napisz funkcje, ktora obraca elementy tablicy w prawo o k pozycji. Tablica i k sa podane jako dane wejsciowe.\n\nPrzyklad:\nWejscie: [1, 2, 3, 4, 5], k = 2\nWyjscie: [4, 5, 1, 2, 3]",
        testCases: [
            {
                input: "1 2 3 4 5;2",
                expectedOutput: "4 5 1 2 3",
                description: "Obrot o 2 pozycje"
            },
            {
                input: "1 2 3 4 5;5",
                expectedOutput: "1 2 3 4 5",
                description: "Obrot o liczbe rowna dlugosci tablicy"
            },
            {
                input: "1 2 3 4 5;0",
                expectedOutput: "1 2 3 4 5",
                description: "Obrot o 0 pozycji"
            },
            {
                input: "1;1",
                expectedOutput: "1",
                description: "Tablica jednoelementowa"
            },
            {
                input: "10 20 30;4",
                expectedOutput: "30 10 20",
                description: "Obrot wiekszy niz dlugosc tablicy"
            }
        ]
    },
    {
        title: "Liczby pierwsze do N",
        description: "Napisz funkcje, ktora zwraca wszystkie liczby pierwsze mniejsze lub rowne N.\n\nPrzyklad:\nWejscie: 10\nWyjscie: [2, 3, 5, 7]",
        testCases: [
            {
                input: "10",
                expectedOutput: "2 3 5 7",
                description: "Liczby pierwsze do 10"
            },
            {
                input: "2",
                expectedOutput: "2",
                description: "Najmniejsza liczba pierwsza"
            },
            {
                input: "1",
                expectedOutput: "",
                description: "Brak liczb pierwszych"
            },
            {
                input: "20",
                expectedOutput: "2 3 5 7 11 13 17 19",
                description: "Liczby pierwsze do 20"
            },
            {
                input: "0",
                expectedOutput: "",
                description: "Zerowe wejscie"
            }
        ]
    },
    {
        title: "Najdluzsze wspolne podciagi",
        description: "Napisz funkcje, ktora zwraca najdluzszy wspolny podciag znakow dwoch ciagow.\n\nPrzyklad:\nWejscie: 'abcde', 'ace'\nWyjscie: 'ace'",
        testCases: [
            {
                input: "abcde;ace",
                expectedOutput: "ace",
                description: "Zwykly przypadek"
            },
            {
                input: "abc;def",
                expectedOutput: "",
                description: "Brak wspolnych znakow"
            },
            {
                input: "abc;abc",
                expectedOutput: "abc",
                description: "Identicalne ciagi"
            },
            {
                input: "abcdefg;abdfg",
                expectedOutput: "abdfg",
                description: "Czesciowe dopasowanie"
            },
            {
                input: "",
                expectedOutput: "",
                description: "Pusty pierwszy ciag"
            }
        ]
    },
    {
        title: "Odwroc ciag znakow",
        description: "Napisz funkcje, ktora odwroci podany ciag znakow.\n\nPrzyklad:\nWejscie: 'hello'\nWyjscie: 'olleh'",
        testCases: [
            {
                input: "hello",
                expectedOutput: "olleh",
                description: "Zwykly ciag znakow"
            },
            {
                input: "a",
                expectedOutput: "a",
                description: "Pojedynczy znak"
            },
            {
                input: "",
                expectedOutput: "",
                description: "Pusty ciag"
            },
            {
                input: "12345",
                expectedOutput: "54321",
                description: "Ciag cyfrowy"
            },
            {
                input: "Ala ma kota",
                expectedOutput: "atok am alA",
                description: "Ciag ze spacjami"
            }
        ]
    },
    {
        title: "Silnia liczby",
        description: "Napisz funkcje, ktora oblicza silnie liczby n (n!).\n\nPrzyklad:\nWejscie: 5\nWyjscie: 120",
        testCases: [
            {
                input: "0",
                expectedOutput: "1",
                description: "Silnia z 0"
            },
            {
                input: "1",
                expectedOutput: "1",
                description: "Silnia z 1"
            },
            {
                input: "5",
                expectedOutput: "120",
                description: "Zwykly przypadek"
            },
            {
                input: "10",
                expectedOutput: "3628800",
                description: "Wieksza liczba"
            },
            {
                input: "15",
                expectedOutput: "1307674368000",
                description: "Jeszcze wieksza liczba"
            }
        ]
    },
    {
        title: "Najczesciej wystepujacy element",
        description: "Napisz funkcje, ktora znajduje element wystepujacy najczesciej w tablicy liczb calkowitych.\n\nPrzyklad:\nWejscie: [1, 2, 2, 3, 3, 3]\nWyjscie: 3",
        testCases: [
            {
                input: "1 2 2 3 3 3",
                expectedOutput: "3",
                description: "Najczesciej 3"
            },
            {
                input: "1 1 1 1 1",
                expectedOutput: "1",
                description: "Wszystkie takie same"
            },
            {
                input: "5 5 4 4 4 5",
                expectedOutput: "4",
                description: "Dwie liczby z rowna liczba wystapien, zwroc mniejsza"
            },
            {
                input: "7",
                expectedOutput: "7",
                description: "Pojedynczy element"
            },
            {
                input: "9 8 7 6 5",
                expectedOutput: "5",
                description: "Brak powtorzen – zwroc najmniejszy"
            }
        ]
    },
    {
        title: "Czy liczba jest doskonala",
        description: "Napisz funkcje, ktora sprawdza, czy dana liczba jest liczba doskonala. Liczba doskonala to taka, ktora jest rowna sumie wszystkich swoich dodatnich dzielnikow (z wyjatkiem samej siebie).\n\nPrzyklad:\nWejscie: 28\nWyjscie: true",
        testCases: [
            {
                input: "6",
                expectedOutput: "true",
                description: "Pierwsza liczba doskonala"
            },
            {
                input: "28",
                expectedOutput: "true",
                description: "Druga liczba doskonala"
            },
            {
                input: "12",
                expectedOutput: "false",
                description: "Zwykla liczba"
            },
            {
                input: "1",
                expectedOutput: "false",
                description: "Brak dzielnikow poza soba"
            },
            {
                input: "496",
                expectedOutput: "true",
                description: "Trzecia liczba doskonala"
            }
        ]
    },
    {
        title: "Zlicz wystapienia znakow",
        description: "Napisz funkcje, ktora zlicza ile razy kazdy znak wystepuje w danym ciagu znakow. Znaki nie powinny byc rozrozaniane pod wzgledem wielkosci liter.\n\nPrzyklad:\nWejscie: 'Hello'\nWyjscie: {h:1, e:1, l:2, o:1}",
        testCases: [
            {
                input: "Hello",
                expectedOutput: "h:1 e:1 l:2 o:1",
                description: "Mieszane litery"
            },
            {
                input: "AaAa",
                expectedOutput: "a:4",
                description: "Ignoruj wielkosc liter"
            },
            {
                input: "",
                expectedOutput: "",
                description: "Pusty ciag"
            },
            {
                input: "abc abc",
                expectedOutput: "a:2 b:2 c:2  :1",
                description: "Znak spacji jako znak"
            },
            {
                input: "123321",
                expectedOutput: "1:2 2:2 3:2",
                description: "Znaki numeryczne"
            }
        ]
    },
    {
        title: "Zamien liczby rzymskie na arabskie",
        description: "Napisz funkcje, ktora konwertuje liczbe rzymska na liczbe arabska (calowita). Przyjmujemy, ze wejscie to poprawna liczba rzymska.\n\nPrzyklad:\nWejscie: 'IX'\nWyjscie: 9",
        testCases: [
            {
                input: "III",
                expectedOutput: "3",
                description: "Najprostsza liczba"
            },
            {
                input: "IV",
                expectedOutput: "4",
                description: "Zlozenie z odejmowaniem"
            },
            {
                input: "IX",
                expectedOutput: "9",
                description: "Kolejny przypadek odejmowania"
            },
            {
                input: "LVIII",
                expectedOutput: "58",
                description: "Zlozona liczba"
            },
            {
                input: "MCMXCIV",
                expectedOutput: "1994",
                description: "Duza liczba rzymska"
            }
        ]
    },
    {
        title: "Czy anagram",
        description: "Napisz funkcje, ktora sprawdza, czy dwa ciagi znakow sa anagramami (posiadaja te same znaki w innej kolejnosci). Wielkosc liter i spacje sa ignorowane.\n\nPrzyklad:\nWejscie: 'Listen', 'Silent'\nWyjscie: true",
        testCases: [
            {
                input: "Listen;Silent",
                expectedOutput: "true",
                description: "Zwykle slowa"
            },
            {
                input: "Hello;Olelh",
                expectedOutput: "true",
                description: "Rozna kolejnosc znakow"
            },
            {
                input: "abc;def",
                expectedOutput: "false",
                description: "Zupelnie inne slowa"
            },
            {
                input: "A gentleman;Elegant man",
                expectedOutput: "true",
                description: "Ignoruj wielkosc i spacje"
            },
            {
                input: "Clint Eastwood;Old West Action",
                expectedOutput: "true",
                description: "Zlozony przypadek z anagramem"
            }
        ]
    },
    {
        title: "Najwieksza suma podciagu",
        description: "Napisz funkcje, ktora znajduje maksymalna sume ciaglego podciagu w tablicy liczb calkowitych (problem maksymalnej sumy podciagu).\n\nPrzyklad:\nWejscie: [-2,1,-3,4,-1,2,1,-5,4]\nWyjscie: 6 (podciag [4,-1,2,1])",
        testCases: [
            {
                input: "-2 1 -3 4 -1 2 1 -5 4",
                expectedOutput: "6",
                description: "Przyklad z klasycznego problemu"
            },
            {
                input: "1 2 3 4",
                expectedOutput: "10",
                description: "Same dodatnie liczby"
            },
            {
                input: "-1 -2 -3 -4",
                expectedOutput: "-1",
                description: "Same ujemne liczby"
            },
            {
                input: "5 -1 5",
                expectedOutput: "9",
                description: "Srodek ujemny"
            },
            {
                input: "0 0 0 0",
                expectedOutput: "0",
                description: "Same zera"
            }
        ]
    },
    {
        title: "Policz wyrazy w zdaniu",
        description: "Napisz funkcje, ktora zlicza liczbe wyrazow w podanym zdaniu. Wyrazy sa rozdzielone spacjami.\n\nPrzyklad:\nWejscie: 'Ala ma kota'\nWyjscie: 3",
        testCases: [
            {
                input: "Ala ma kota",
                expectedOutput: "3",
                description: "Trzy wyrazy"
            },
            {
                input: "Hello world",
                expectedOutput: "2",
                description: "Dwa wyrazy"
            },
            {
                input: "  ",
                expectedOutput: "0",
                description: "Same spacje"
            },
            {
                input: "",
                expectedOutput: "0",
                description: "Pusty ciag"
            },
            {
                input: "Jedno",
                expectedOutput: "1",
                description: "Jeden wyraz"
            }
        ]
    },
    {
        title: "Suma cyfr liczby",
        description: "Napisz funkcje, ktora oblicza sume cyfr danej liczby calkowitej dodatniej.\n\nPrzyklad:\nWejscie: 1234\nWyjscie: 10",
        testCases: [
            {
                input: "1234",
                expectedOutput: "10",
                description: "Zwykla liczba"
            },
            {
                input: "0",
                expectedOutput: "0",
                description: "Zero"
            },
            {
                input: "9",
                expectedOutput: "9",
                description: "Pojedyncza cyfra"
            },
            {
                input: "1001",
                expectedOutput: "2",
                description: "Liczba z zerami"
            },
            {
                input: "9999",
                expectedOutput: "36",
                description: "Najwieksza suma cyfr dla 4 cyfr"
            }
        ]
    },
    {
        title: "Polacz dwie tablice",
        description: "Napisz funkcje, ktora laczy dwie tablice liczb calkowitych i zwraca wynikowa tablice posortowana rosnaco.\n\nPrzyklad:\nWejscie: [1,3,5], [2,4,6]\nWyjscie: [1,2,3,4,5,6]",
        testCases: [
            {
                input: "1 3 5;2 4 6",
                expectedOutput: "1 2 3 4 5 6",
                description: "Dwie uporzadkowane tablice"
            },
            {
                input: "5 3 1;6 4 2",
                expectedOutput: "1 2 3 4 5 6",
                description: "Tablice nieuporzadkowane"
            },
            {
                input: "1 2 3;",
                expectedOutput: "1 2 3",
                description: "Druga tablica pusta"
            },
            {
                input: ";4 5 6",
                expectedOutput: "4 5 6",
                description: "Pierwsza tablica pusta"
            },
            {
                input: ";",
                expectedOutput: "",
                description: "Obie tablice puste"
            }
        ]
    },
    {
        title: "Sprawdz czy liczba jest potega dwojki",
        description: "Napisz funkcje, ktora sprawdza, czy dana liczba calkowita dodatnia jest potega dwojki.\n\nPrzyklad:\nWejscie: 16\nWyjscie: true",
        testCases: [
            {
                input: "16",
                expectedOutput: "true",
                description: "Potega dwojki"
            },
            {
                input: "1",
                expectedOutput: "true",
                description: "1 jest 2 do potegi 0"
            },
            {
                input: "18",
                expectedOutput: "false",
                description: "Nie jest potege dwojki"
            },
            {
                input: "0",
                expectedOutput: "false",
                description: "Zero nie jest potege dwojki"
            },
            {
                input: "64",
                expectedOutput: "true",
                description: "Wieksza potege dwojki"
            }
        ]
    }
]);

db.createCollection('completed_tasks');
