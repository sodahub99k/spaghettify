// src/spoiler/wasm/spoile_wasm.cpp
#include <cstring>
#include <cstdlib>
#include <string>
#include <sstream>

#include "../main/spoile.hpp"

extern "C"
{

  // C 文字列を受け取り、結果文字列を malloc して返す。
  // 呼び出し側は必ず free_string() で解放すること。
  char *spoile_str_c(const char *input)
  {
    if (!input)
      return nullptr;
    try
    {
      std::string in(input);
      std::string out = spoile_str(in);

      // malloc で領域を確保して返す（JS 側で _free を使って解放）
      char *res = (char *)malloc(out.size() + 1);
      if (!res)
        return nullptr;
      memcpy(res, out.c_str(), out.size() + 1);
      return res;
    }
    catch (...)
    {
      return nullptr;
    }
  }

  // C側で確保された文字列を解放するラッパー（ついでに公開）
  void free_string(char *p)
  {
    if (p)
      free(p);
  }

} // extern "C"
