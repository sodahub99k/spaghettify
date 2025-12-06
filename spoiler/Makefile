########################################
# Paths
########################################

WEB_WASM_DIR := ../src/wasm
ROOT    := src/spoiler
BIN     := bin
FLEX    := /opt/homebrew/opt/flex/bin/flex
FLEXINC := /opt/homebrew/opt/flex/include

EMXX    := em++
CXX     := g++

########################################
# Files
########################################

LEXER   := $(ROOT)/lexer/lexer.gen.cpp
PARSER  := $(ROOT)/parser/parser.tab.cc

COMMON  := \
	$(ROOT)/driver/driver.cpp \
	$(ROOT)/main/spoile.cpp

NATIVE_SRCS := \
	$(LEXER) \
	$(PARSER) \
	$(COMMON) \
	$(ROOT)/main/main.cpp

WASM_SRCS := \
	$(LEXER) \
	$(PARSER) \
	$(COMMON) \
	$(ROOT)/wasm/spoile_wasm.cpp

########################################
# Output files
########################################

NATIVE_OUT  := $(BIN)/spoiler
WASM_JS     := $(BIN)/spoile.js
WASM_WASM   := $(BIN)/spoile.wasm

########################################
# Flags
########################################

CXXFLAGS := -I$(FLEXINC) -I src -Wall -Wextra -std=c++11 -O3 -g

EMFLAGS := -O3 --llvm-lto 1 -I$(FLEXINC)

LDFLAGS_WASM := \
  -s WASM=1 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s EXPORTED_FUNCTIONS='["_spoile_str_c","_free_string","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap","UTF8ToString"]'

########################################
# Phony
########################################

.PHONY: all native wasm clean run

########################################
# Main Targets
########################################

all: clean native wasm

native: $(NATIVE_OUT)

wasm: $(WASM_JS)

########################################
# Run
########################################

run: native
	@printf "\n\033[32m[RUN]\033[0m %s\n" "$(NATIVE_OUT) example/input.c\n"
	@$(NATIVE_OUT) example/input.c

########################################
# Build Native
########################################

$(NATIVE_OUT): $(LEXER) $(PARSER)
	@mkdir -p $(BIN)
	@printf "\n\033[33m[NATIVE]\033[0m Building -> %s\n" "$@"
	@$(CXX) $(CXXFLAGS) -o $@ $(NATIVE_SRCS)

########################################
# Build WASM
########################################

$(WASM_JS): $(LEXER) $(PARSER)
	@mkdir -p $(BIN)
	@printf "\n\033[36m[WASM]\033[0m Building -> %s\n" "$@"
	@$(EMXX) $(EMFLAGS) $(LDFLAGS_WASM) \
		$(WASM_SRCS) \
		-o $@
	@printf "\033[36m[WASM]\033[0m Generated: %s %s\n" "$(BIN)/spoile.js" "$(BIN)/spoile.wasm"
	@cp $(BIN)/spoile.wasm $(WEB_WASM_DIR)/spoile.wasm
	@cp $(BIN)/spoile.js $(WEB_WASM_DIR)/spoile.js

########################################
# Flex / Bison
########################################

$(PARSER): $(ROOT)/parser/parser.yy
	@printf "\n\033[35m[BISON]\033[0m %s -> %s\n" "$<" "$@"
	@bison -v -o $@ $<

$(LEXER): $(ROOT)/lexer/lexer.ll
	@printf "\n\033[35m[FLEX]\033[0m %s -> %s\n" "$<" "$@"
	@$(FLEX) --c++ --outfile=$@ $<

########################################
# Clean
########################################

clean:
	@printf "\n\033[31m[CLEAN]\033[0m Removing generated files\n"
	@rm -rf $(BIN)
	@rm -f $(ROOT)/lexer/lexer.gen.*
	@rm -f $(ROOT)/parser/parser.tab.*
	@rm -f $(ROOT)/parser/location.hh
	@rm -f $(ROOT)/parser/parser.output
	@rm -rf $(ROOT)/main/*.dSYM
