<template>
  <div class="expression">
    <h1 class="title">オンライン胡算器</h1>
    <div class="display">
      <input v-model="expression.raw" class="eq-input" type="text" />
      <div class="hor-line" />
      <div
        :class="{
          result: true,
          'error-result': expression.isResultError,
        }"
      >
        {{ expression.calc(expression.raw) }}
      </div>
    </div>
    <ul class="input_buttons">
      <li v-for="k in expression.uiKeys" :key="k">
        <button class="ui_button" @click="expression.raw += k">{{ k }}</button>
      </li>
    </ul>
    <ul class="control_buttons">
      <li>
        <button
          class="ui_button control_button"
          @click="expression.backspace()"
        >
          Del
        </button>
      </li>
      <li>
        <button class="ui_button control_button" @click="expression.clear()">
          Clear
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    interface Rice {
      eval(): Rice;
      hasTwo(): boolean;
      lift(): Rice;
      toString(): string;
    }
    class Equation implements Rice {
      rices: Rice[];
      constructor(rices: Rice[]) {
        this.rices = rices;
      }

      eval() {
        if (this.rices.length !== 2) {
          return new Daniel();
        }
        const [lhs, rhs] = this.rices;
        if (lhs.toString() === '牧') {
          return new Sentence([
            new Round(new Sentence([new Yu(0), new Yu(1), rhs, new Yu(0)])),
          ]);
        }
        const newLhs = rhs.hasTwo() ? new Yu(2) : lhs.eval();
        const newRhs = lhs.hasTwo() ? new Yu(2) : rhs.eval();
        return new Sentence([newLhs, new Round(newRhs)]);
      }

      hasTwo() {
        return this.rices.some(x => x.hasTwo());
      }

      lift() {
        return new Equation(this.rices.map(x => x.lift()));
      }

      toString() {
        if (this.rices.length !== 2) {
          return new Daniel().toString();
        }
        const [lhs, rhs] = this.rices;
        return '' + lhs + '=' + rhs;
      }
    }
    class Sentence implements Rice {
      terms: Rice[];
      constructor(terms: Rice[]) {
        this.terms = terms;
      }

      eval() {
        return new Sentence(this.terms.map(x => x.eval()));
      }

      hasTwo() {
        return this.terms.some(x => x.hasTwo());
      }

      lift() {
        return new Sentence(this.terms.map(x => x.lift()));
      }

      toString() {
        return this.terms.map(x => x.toString()).join('');
      }
    }

    class Round implements Rice {
      inside: Rice;
      constructor(inside: Rice) {
        this.inside = inside;
      }

      eval() {
        return this.inside.eval().lift();
      }

      hasTwo() {
        return this.inside.hasTwo();
      }

      lift() {
        return new Round(this.inside.lift());
      }

      toString() {
        return '(' + this.inside + ')';
      }
    }

    class Yu implements Rice {
      contents: 0 | 1 | 2;
      constructor(contents: 0 | 1 | 2) {
        this.contents = contents;
      }

      eval() {
        return this;
      }

      hasTwo() {
        return this.contents === 2;
      }

      lift() {
        switch (this.contents) {
          case 0:
            return new Yu(1);
          case 1:
          case 2:
            return new Yu(2);
        }
      }

      toString() {
        return ['7', '牧', '^^'][this.contents];
      }
    }

    class Daniel implements Rice {
      eval() {
        return this;
      }

      hasTwo() {
        return false;
      }

      lift() {
        return this;
      }

      toString() {
        return 'D';
      }
    }

    class ParseError {
      msg: string;
      constructor(msg: string) {
        this.msg = msg;
      }

      eval() {
        return this.msg;
      }
    }

    return {
      expression: {
        raw: '',
        isResultError: false,
        uiKeys: ['7', '^^', '牧', '(', ')', '='],
        calc(str: string): string {
          const parseResult = this.parse(str);
          const expr = parseResult.eval().toString();
          this.isResultError = parseResult instanceof ParseError;

          if (expr.includes('D')) {
            return '(´∀｀*)ｳﾌﾌ';
          } else {
            return expr;
          }
        },
        backspace() {
          if (this.raw.length === 0) {
            return;
          }

          if (this.raw.endsWith('^^')) {
            this.raw = this.raw.slice(0, this.raw.length - 2);
            return;
          }

          this.raw = this.raw.slice(0, this.raw.length - 1);
        },
        clear() {
          this.raw = '';
        },
        parse(str: String): Rice | ParseError {
          const stack: (Rice | '=')[][] = [];
          let frontier: (Rice | '=')[] = [];
          const code = str
            .replace(/ /g, '')
            .replace(/7/g, '0')
            .replace(/牧/g, '1')
            .replace(/\^\^/g, '2');
          for (const c of code) {
            switch (c) {
              case '0':
                frontier.push(new Yu(0));
                break;
              case '1':
                frontier.push(new Yu(1));
                break;
              case '2':
                frontier.push(new Yu(2));
                break;
              case '=':
                frontier.push('=');
                break;
              case '(':
                stack.push(frontier);
                frontier = [];
                break;
              case ')':
                {
                  const tmp = stack.pop();
                  if (tmp === undefined) {
                    return new ParseError(
                      'Parse Error: 丸はしっかり閉じましょう'
                    );
                  }
                  if (frontier.length === 0) {
                    return new ParseError('Parse Error: 空っぽ');
                  }
                  if (
                    frontier[0] === '=' ||
                    frontier[frontier.length - 1] === '='
                  ) {
                    return new ParseError('Parse Error: 端っこに=は置けません');
                  }

                  const riceField: Rice[][] = [[]];
                  for (const token of frontier) {
                    if (token === '=') {
                      riceField.push([]);
                    } else {
                      riceField[riceField.length - 1].push(token);
                    }
                  }
                  if (riceField.length === 1) {
                    tmp.push(new Round(new Sentence(riceField[0])));
                  } else {
                    tmp.push(
                      new Equation(riceField.map(rices => new Sentence(rices)))
                    );
                  }
                  frontier = tmp;
                }
                break;
              default:
                return new ParseError(
                  'Parse Error:  知らない文字「' + c + '」'
                );
            }
          }
          if (stack.length > 0) {
            return new ParseError('Parse Error: 丸はしっかり閉じましょう');
          }
          if (
            frontier.length > 0 &&
            (frontier[0] === '=' || frontier[frontier.length - 1] === '=')
          ) {
            return new ParseError('Parse Error: 端っこに=は置けません');
          }
          const riceField: Rice[][] = [[]];
          for (const token of frontier) {
            if (token === '=') {
              riceField.push([]);
            } else {
              riceField[riceField.length - 1].push(token);
            }
          }
          if (riceField.length === 1) {
            return new Sentence(riceField[0]);
          } else {
            return new Equation(riceField.map(rices => new Sentence(rices)));
          }
        },
      },
    };
  },
};
</script>

<style scoped>
* {
  font-family: 'M PLUS Rounded 1c', sans-serif;
}

.title {
  margin-top: 40px;
  text-align: center;
  font-family: 'Noto Sans JP', sans-serif;
  color: #777;
  font-size: 24px;
}

.display {
  width: 400px;
  max-width: 80vw;
  margin: 40px auto 0;
}

.eq-input {
  display: block;
  margin: 0 auto;
  border: 1px solid #eee;
  text-align: center;
  height: 40px;
  font-size: 19px;
  line-height: 40px;
  color: #777;
  width: 80%;
  font-weight: 300;
}

.hor-line {
  border-top: 1px solid #777;
  margin: 20px 0 17px;
  width: 100%;
}

.result {
  display: block;
  margin: 0 auto;
  text-align: center;
  height: 40px;
  font-size: 19px;
  line-height: 20px;
  padding: 10px 0;
  color: #777;
  width: 80%;
}

.error-result {
  color: #cc6666;
  font-size: 0.75em;
}

.input_buttons {
  list-style: none;

  width: 350px;
  max-width: 75vw;

  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 30px auto 0;
  padding: 0;
}

.input_buttons > li {
  flex: 1 0 30%;
  padding: 6px;
  box-sizing: border-box;
}

.control_buttons > li {
  flex: 1 0 50%;
  padding: 6px;
  box-sizing: border-box;
}

.ui_button {
  padding: 0 10px;
  width: 100%;
  border: none;
  height: 70px;
  background-color: #eee;
  color: #777;
  font-size: 20px;
}

.control_button {
  height: 45px;
}

.control_buttons {
  list-style: none;

  width: 350px;
  max-width: 75vw;

  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 25px auto 0;
  padding: 0;
}
</style>
