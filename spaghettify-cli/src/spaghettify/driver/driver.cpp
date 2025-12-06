#include <cassert>
#include "../driver/driver.hpp"

yy::Driver::~Driver()
{
    delete lexer;
    lexer = nullptr;
    delete parser;
    parser = nullptr;
}

void yy::Driver::parse(std::istream &in, std::ostream &out)
{
    assert(in.good());
    if (in.eof())
    {
        return;
    }

    delete (lexer);
    try
    {
        lexer = new yy::Lexer(&in);
    }
    catch (std::bad_alloc &err)
    {
        std::cerr << "[Error] Failed to allocate lexer: (" << err.what() << ")"
                  << std::endl;
        exit(1);
    }

    delete (parser);
    try
    {
        parser = new yy::Parser(*lexer, *this, out);
    }
    catch (std::bad_alloc &err)
    {
        std::cerr << "[Error] Failed to allocate parser: (" << err.what() << ")"
                  << std::endl;
        exit(1);
    }

    parser->parse();
}