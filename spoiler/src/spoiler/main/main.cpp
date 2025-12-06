#include <fstream>
#include <iostream>
#include <ctime>
#include "spoile.hpp"

int main(int argc, char **argv)
{
    if (argc != 2)
    {
        std::cerr << "[Error] spoiler requests 1 input file." << std::endl;
        return 1;
    }

    const std::string filename = argv[1];

    // 入力読み込み
    std::ifstream input_file(filename);
    if (!input_file)
    {
        std::cerr << "[Error] No such file or directory: '" << filename << "'" << std::endl;
        return 1;
    }

    srand((unsigned)time(NULL));

    // 実際のspoile処理
    std::ostringstream result;
    spoile(input_file, result);
    input_file.close();

    // 上書き保存
    std::ofstream output_file(filename);
    if (!output_file)
    {
        std::cerr << "[Error] Cannot open file for writing: '" << filename << "'" << std::endl;
        return 1;
    }
    output_file << result.str();
    output_file.close();

    std::cout << "[Success] formatted '" << filename << "'." << std::endl;
    return 0;
}
