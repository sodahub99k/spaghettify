#include <fstream>
#include <iostream>
#include <ctime>
#include "spaghettify.hpp"

int main(int argc, char **argv)
{
    if (argc != 2)
    {
        std::cerr << "[Error] spaghettify requests 1 input file." << std::endl;
        return 1;
    }

    const std::string filename = argv[1];

    std::ifstream input_file(filename);
    if (!input_file)
    {
        std::cerr << "[Error] No such file or directory: '" << filename << "'" << std::endl;
        return 1;
    }

    srand((unsigned)time(NULL));

    std::ostringstream result;
    spaghettify(input_file, result);
    input_file.close();

    // input.c -> input_spaghettified.c
    const std::string output_filename =
        filename.substr(0, filename.find_last_of('.')) + "_spaghettified" +
        filename.substr(filename.find_last_of('.'));

    std::ofstream output_file(output_filename);
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
