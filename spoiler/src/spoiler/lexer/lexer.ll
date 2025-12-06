%{
#include <string>
#include "lexer_def.hpp"

#undef YY_DECL
#define YY_DECL int yy::Lexer::yylex( \
    yy::Parser::semantic_type* const lval, \
    yy::Parser::location_type* loc \
)

#define yyterminate() return yy::Parser::token::END
#define YY_NO_UNISTD_H

#define YY_NO_INPUT    // ★ 追加
#define YY_NO_OUTPUT   // ★ 追加

#define SAVE_AS(t) do { \
    yylval->build<std::string>(yytext); \
    return yy::Parser::token::t; \
} while (0)

%}

%option yyclass="yy::Lexer"
%option debug noyywrap noinput nounput c++

D			[0-9]
L			[a-zA-Z_]
H			[a-fA-F0-9]
E			([Ee][+-]?{D}+)
P           ([Pp][+-]?{D}+)
FS			(f|F|l|L)
IS          ((u|U)|(u|U)?(l|L|ll|LL)|(l|L|ll|LL)(u|U))

WS          (" "|\t|\r?\n)*


comment1    "/*"((\*+[^/*])|([^*]))*\**"*/"
comment2    \/\/.*\n
comment     {comment1}|{comment2}

string      L?\"(\\.|[^\\"\n])*\"
char        L?'\\.|[^\\'\n]'

identifier  {L}({L}|{D})*

integer     0[xX]{H}+{IS}?|0[0-7]*{IS}?|[1-9]{D}*{IS}?
floating    {D}+{E}{FS}?{D}*"."{D}+{E}?{FS}?|{D}+"."{D}*{E}?{FS}?|0[xX]{H}+{P}{FS}?|0[xX]{H}*"."{H}+{P}?{FS}?|0[xX]{H}+"."{H}*{P}?{FS}?
number    {integer}|{floating}


directive   #.+?\n

symbol      "..."|">>="|"<<="|"+="|"-="|"*="|"/="|"%="|"&="|"^="|"|="|">>"|"<<"|"++"|"--"|"->"|"&&"|"||"|"<="|">="|"=="|"!="|";"|("{"|"<%")|("}"|"%>")|","|":"|"="|"("|")"|("["|"<:")|("]"|":>")|"."|"&"|"!"|"~"|"-"|"+"|"*"|"/"|"%"|"<"|">"|"^"|"|"|"?"

%%

%{
    yylval = lval;
%}

{comment}       { SAVE_AS(STRONG); }
{string}        { SAVE_AS(STRONG); }
{char}          { SAVE_AS(STRONG); }
{identifier}    { SAVE_AS(WEAK); }
{number}        { SAVE_AS(WEAK); }
{directive}     { SAVE_AS(DIRECTIVE); }
{symbol}        { SAVE_AS(STRONG); }
{WS}            { /* ignore */ }
.               { SAVE_AS(WEAK); }

%%

