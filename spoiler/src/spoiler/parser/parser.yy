%skeleton "lalr1.cc"
%defines 
%define api.namespace {yy}

%define api.parser.class {Parser}

%code requires {
#include "../lexer/token_type.hpp"

    namespace yy {
        class Driver;
        class Lexer;
    }

    # ifndef YY_NULLPTR
    #  if defined __cplusplus && 201103L <= __cplusplus
    #   define YY_NULLPTR nullptr
    #  else
    #   define YY_NULLPTR 0
    #  endif
    # endif

    #define DEBUG 0

}

%parse-param {Lexer& lexer} {Driver& driver} {std::ostream& out}


%code {
    #include <iostream>
    #include <fstream>
    #include "../driver/driver.hpp"

    #undef yylex
    #define yylex lexer.yylex
}

%define api.value.type variant
%define parse.assert

%token END 0
%token <std::string> STRONG WEAK DIRECTIVE

%type <c_tok>
    tokens token

%locations

%%

program
    : %empty {out << "";}
    | tokens {out << $1.str;}
    ;

tokens
    : token {
        $$ = $1;
    }
    | tokens token {
        $$.str = $1.str;

        #if DEBUG == 1
            $$.str +=  (($1.close || $2.close)? "" : " ") + $2.str;
        #else
            int r;
            bool empty = true;
            while (1) {
                r = rand() % 100 + 1;
                if      (0  < r && r <= 55) {break;}                // 55%
                else {
                    empty = false;
                    if      (r <= 95) {$$.str += " ";}              // 40%
                    else if (r <= 97) {$$.str += "\n";}             // 2%
                    else if (r == 98) {$$.str += "\n  ";}           // 1%
                    else if (r == 99) {$$.str += "\n        ";}     // 1%
                    else              {$$.str += "\n           ";}  // 1%
                }
            }

            if (!($1.close || $2.close) && empty) {
                r = rand() % 100 + 1;
                if      (r <= 95) {$$.str += " ";}              // 95%
                else if (r <= 97) {$$.str += "\n";}             // 2%
                else if (r == 98) {$$.str += "\n   ";}          // 1%
                else if (r == 99) {$$.str += "\n      ";}       // 1%
                else              {$$.str += "\n            ";} // 1%
            }
        #endif

        $$.str += $2.str;
        $$.close = $2.close;
    }
    ;

token
    : WEAK {
        $$.close = false;
        $$.str = $1;
    }
    | STRONG {
        $$.close = true;
        $$.str = $1;
    }
    | DIRECTIVE {
        $$.close = true;
        $$.str = "\n" + $1;
    }
    ;

%%

void 
yy::Parser::error(const location_type &loc, const std::string &msg) {
   std::cerr << "[Error] " << msg << " at " << loc << "\n";
}