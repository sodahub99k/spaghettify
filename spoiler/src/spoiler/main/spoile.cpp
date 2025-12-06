#include <sstream>
#include "../driver/driver.hpp"
#include "spoile.hpp"

void spoile(std::istream &in, std::ostream &out)
{
  yy::Driver driver;
  driver.parse(in, out);
}

std::string spoile_str(const std::string &input)
{
  std::istringstream iss(input);
  std::ostringstream oss;
  spoile(iss, oss);
  return oss.str();
}
