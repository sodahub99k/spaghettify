#pragma once
#include <istream>
#include <ostream>
#include <sstream>
#include <string>

// istream -> ostream 変換
void spaghettify(std::istream &in, std::ostream &out);

// string -> string 変換
std::string spaghettify_str(const std::string &input);
