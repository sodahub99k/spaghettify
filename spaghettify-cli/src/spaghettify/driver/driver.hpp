#pragma once

#include <istream>
#include "../lexer/lexer_def.hpp"
#include "../parser/parser.tab.hh"
#include <string>

namespace yy
{
    class Driver
    {
    public:
        Driver() = default;
        virtual ~Driver();

        void parse(std::istream &in, std::ostream &out);

    private:
        yy::Parser *parser = nullptr;
        yy::Lexer *lexer = nullptr;
    };
} // namespace yy