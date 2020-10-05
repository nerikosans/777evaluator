<template>
  <div class="expression">
    <form @submit.prevent>
      <label>
        ョ米
        <input type="text" v-model="expression.raw" />
      </label>
      <button type="submit">胡す</button>
    </form>
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

<script lang="ts">
export default {
  data() {
    interface Rice {
      eval(): Rice;
      hasTwo(): boolean;
      lift(): Rice;
      toString(): String;
    }
    class Equation implements Rice {
      rices: Rice[];
      constructor(rices: Rice[]) {
        this.rices = rices;
      }
      eval() {
        if (this.rices.length != 2) return new Daniel();
        var [lhs, rhs] = this.rices;
        if (lhs.toString() == '牧') {
          return new Sentence([
            new Round(new Sentence([new Yu(0), new Yu(1), rhs, new Yu(0)])),
          ]);
        }
        var new_lhs = rhs.hasTwo() ? new Yu(2) : lhs.eval();
        var new_rhs = lhs.hasTwo() ? new Yu(2) : rhs.eval();
        return new Sentence([new_lhs, new Round(new_rhs)]);
      }
      hasTwo() {
        return this.rices.some(x => x.hasTwo());
      }
      lift() {
        return new Equation(this.rices.map(x => x.lift()));
      }
      toString() {
        if (this.rices.length != 2) return new Daniel().toString();
        var [lhs, rhs] = this.rices;
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
        return this.contents == 2;
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
      msg: String;
      constructor(msg: String) {
        this.msg = msg;
      }
      eval() {
        return this.msg;
      }
    }

    return {
      expression: {
        raw: '',
        calc: function (str: String): String {
          var expr = this.parse(str).eval().toString();
          if (expr.includes('D')) return '(´∀｀*)ｳﾌﾌ';
          else return expr;
        },
        parse: function (str: String): Rice | ParseError {
          var stack: (Rice | '=')[][] = [];
          var frontier: (Rice | '=')[] = [];
          var code = str
            .replace(/ /g, '')
            .replace(/7/g, '0')
            .replace(/牧/g, '1')
            .replace(/\^\^/g, '2');
          for (var c of code) {
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
                var tmp = stack.pop();
                if (tmp === undefined)
                  return new ParseError(
                    'Parse Error: 丸はしっかり閉じましょう'
                  );
                if (frontier.length == 0)
                  return new ParseError('Parse Error: 空っぽ');
                if (frontier[0] == '=' || frontier[frontier.length - 1] == '=')
                  return new ParseError('Parse Error: 端っこに=は置けません');

                var rice_field: Rice[][] = [[]];
                for (var token of frontier) {
                  if (token === '=') rice_field.push([]);
                  else rice_field[rice_field.length - 1].push(token);
                }
                if (rice_field.length == 1)
                  return new Round(new Sentence(rice_field[0]));
                else
                  return new Equation(
                    rice_field.map(rices => new Sentence(rices))
                  );
                break;
              default:
                return new ParseError(
                  'Parse Error:  知らない文字「' + c + '」'
                );
            }
          }
          if (stack.length > 0)
            return new ParseError('Parse Error: 丸はしっかり閉じましょう');
          if (
            frontier.length > 0 &&
            (frontier[0] == '=' || frontier[frontier.length - 1] == '=')
          )
            return new ParseError('Parse Error: 端っこに=は置けません');
          var rice_field: Rice[][] = [[]];
          for (var token of frontier) {
            if (token == '=') rice_field.push([]);
            else rice_field[rice_field.length - 1].push(token);
          }
          if (rice_field.length == 1) return new Sentence(rice_field[0]);
          else
            return new Equation(rice_field.map(rices => new Sentence(rices)));
        },
      },
    };
  },
};
</script>
