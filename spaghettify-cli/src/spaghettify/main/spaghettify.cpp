#include <sstream>
#include "../driver/driver.hpp"
#include "spaghettify.hpp"

void spaghettify(std::istream &in, std::ostream &out)
{
  yy::Driver driver;
  driver.parse(in, out);
}

std::string spaghettify_str(const std::string &input)
{
  std::istringstream iss(input);
  std::ostringstream oss;
  spaghettify(iss, oss);
  return oss.str();
}
