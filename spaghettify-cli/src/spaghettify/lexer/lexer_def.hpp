#pragma once

#ifndef yyFlexLexerOnce
#include "FlexLexer.h"
#endif

#include <istream>
#include "../parser/location.hh"
#include "../parser/parser.tab.hh"

namespace yy
{
    class Lexer : public yyFlexLexer
    {
    public:
        Lexer(std::istream *in) : yyFlexLexer(in) {}
        virtual ~Lexer() {}

        virtual int yylex(yy::Parser::semantic_type *const lval,
                          yy::Parser::location_type *loc);

    private:
        yy::Parser::semantic_type *yylval = nullptr;
    };
} // namespace yy