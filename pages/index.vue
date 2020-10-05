<template>
  <div class="expression">
    <form @submit.prevent>
      <label>
        ョ米
        <input type="text" v-model="expression.raw" />
      </label>
    </form>
    <ul class="input_buttons">
      <li>
        <button class="ui_button" v-on:click="expression.raw += '7'">7</button>
      </li>
      <li>
        <button class="ui_button" v-on:click="expression.raw += '^^'">
          ^^
        </button>
      </li>
      <li>
        <button class="ui_button" v-on:click="expression.raw += '牧'">
          牧
        </button>
      </li>
      <li>
        <button class="ui_button" v-on:click="expression.raw += '('">(</button>
      </li>
      <li>
        <button class="ui_button" v-on:click="expression.raw += ')'">)</button>
      </li>
      <li>
        <button class="ui_button" v-on:click="expression.raw += '='">=</button>
      </li>
    </ul>
    <ul class="control_buttons">
      <li>
        <button class="ui_button" v-on:click="expression.backspace()">
          Del
        </button>
      </li>
      <li>
        <button class="ui_button" v-on:click="expression.clear()">Clear</button>
      </li>
    </ul>
    <ul>
      <li>
        <p>元のョ米: {{ expression.raw }}</p>
      </li>
      <li>
        <p>胡結果: {{ expression.calc(expression.raw) }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    class Equation {
      constructor(lhs, rhs) {
        this.lhs = lhs;
        this.rhs = rhs;
      }
      eval() {
        if (
          this.lhs.terms !== undefined &&
          this.lhs.terms.length === 1 &&
          this.lhs.terms[0].contents === 1
        ) {
          return new Sentence([
            new Round(
              new Sentence([new Yu(0), new Yu(1), this.rhs, new Yu(0)])
            ),
          ]);
        }
        var new_lhs = this.rhs.hasTwo() ? new Yu(2) : this.lhs;
        var new_rhs = this.lhs.hasTwo() ? new Yu(2) : this.rhs;
        new_lhs = new_lhs.eval();
        new_rhs = new_rhs.eval();
        return new Sentence([new_lhs, new Round(new_rhs)]);
      }
      hasTwo() {
        return this.lhs.hasTwo() || this.rhs.hasTwo();
      }
      lift() {
        return new Equation(this.lhs.lift(), this.rhs.lift());
      }
      toString() {
        return '' + this.lhs + '=' + this.rhs;
      }
    }
    class Sentence {
      constructor(terms) {
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

    class Round {
      constructor(inside) {
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

    class Yu {
      constructor(contents) {
        this.contents = contents;
      }
      eval() {
        return this;
      }
      hasTwo() {
        return this.contents == 2;
      }
      lift() {
        return new Yu(Math.min(this.contents + 1, 2));
      }
      toString() {
        if (this.contesnts < 0) return 'X';
        return ['7', '牧', '^^'][this.contents];
      }
    }

    class Daniel {
      constructor() {}
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
      constructor(msg) {
        this.msg = msg;
      }
      eval() {
        return this.msg;
      }
    }

    return {
      expression: {
        // 初期値を入れる
        raw: '',
        calc: function (str) {
          var expr = this.parse(str).eval().toString();
          if (expr.includes('D')) return '(´∀｀*)ｳﾌﾌ';
          else return expr;
        },
        backspace() {
          if (this.raw.length === 0) {
            return;
          }

          if (this.raw.endsWith('^')) {
            this.raw = this.raw.slice(0, this.raw.length - 2);
            return;
          }

          this.raw = this.raw.slice(0, this.raw.length - 1);
        },
        clear() {
          this.raw = '';
        },
        parse: function (str) {
          var stack = [];
          var frontier = [];
          var code = str
            .replace(/ /g, '')
            .replace(/7/g, '0')
            .replace(/牧/g, '1')
            .replace(/\^\^/g, '2');
          for (var c of code) {
            switch (c) {
              case '0':
              case '1':
              case '2':
                frontier.push(new Yu(parseInt(c)));
                break;
              case '=':
                frontier.push('=');
                break;
              case '(':
                stack.push(frontier);
                frontier = [];
                break;
              case ')':
                if (stack.length == 0)
                  return new ParseError(
                    'Parse Error: 丸はしっかり閉じましょう'
                  );
                var tmp = stack.pop();
                if (frontier.length == 0)
                  return new ParseError('Parse Error: 空っぽ');
                if (frontier[0] == '=' || frontier[frontier.length - 1] == '=')
                  return new ParseError('Parse Error: 端っこに=は置けません');
                var eq_pos = frontier.findIndex(x => x == '=');
                if (eq_pos == -1) {
                  tmp.push(new Round(new Sentence(frontier)));
                } else {
                  var lhs = frontier.slice(0, eq_pos);
                  var rhs = frontier.slice(eq_pos + 1);
                  if (rhs.some(x => x == '=')) return new Daniel();
                  tmp.push(
                    new Round(
                      new Equation(new Sentence(lhs), new Sentence(rhs))
                    )
                  );
                }
                frontier = tmp;
                break;
              default:
                return new ParseError(
                  'Parse Error:  知らない文字「' + c + '」'
                );
            }
          }
          console.log(frontier);
          if (stack.length > 0)
            return new ParseError('Parse Error: 丸はしっかり閉じましょう');
          if (
            frontier.length > 0 &&
            (frontier[0] == '=' || frontier[frontier.length - 1] == '=')
          )
            return new ParseError('Parse Error: 端っこに=は置けません');
          var eq_pos = frontier.findIndex(x => x == '=');
          if (eq_pos == -1) return new Sentence(frontier);
          else {
            console.log(lhs);
            var lhs = frontier.slice(0, eq_pos);
            var rhs = frontier.slice(eq_pos + 1);
            if (rhs.some(x => x == '=')) return new Daniel();
            return new Equation(new Sentence(lhs), new Sentence(rhs));
          }
        },
      },
    };
  },
};
</script>

<style scoped>
.input_buttons {
  list-style: none;

  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.input_buttons > li,
.control_buttons > li {
  margin: 0 10px;
}

.ui_button {
  padding: 0 10px;
  height: 30px;
}

.control_buttons {
  list-style: none;

  width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: left;
}
</style>