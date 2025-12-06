#pragma once
#include <istream>
#include <ostream>
#include <sstream>
#include <string>

// istream -> ostream 変換
void spoile(std::istream &in, std::ostream &out);

// string -> string 変換
std::string spoile_str(const std::string &input);
