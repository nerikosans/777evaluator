<template>
    <div class="expression">
        <form @submit.prevent>
            <label>
                ョ米
                <input type="text" v-model="expression.raw">
            </label>
            <button type="submit">胡す</button>
        </form>
        <ul>
            <li>
                <p> 元のョ米: {{expression.raw}} </p>                
            </li>
            <li>
                <p> 胡結果: {{expression.parse(expression.raw).eval()}} </p>                
            </li>
        </ul>
    </div>
</template>

<script>
export default {
data () {
    class Equation{
        constructor(lhs, rhs){
            this.lhs = lhs;
            this.rhs = rhs;
        }
        eval(){
            if(this.lhs.contents !== undefined && this.lhs.contents == 1){
                return new Sentence(1, undefined, new Round(new Sentence([new Yu(0), new Yu(1),this.rhs,new Yu(0)])));
            }
            var new_lhs = this.rhs.hasTwo() ? new Yu(2): this.lhs;
            var new_rhs = this.lhs.hasTwo() ? new Yu(2): this.rhs;
            new_lhs = new_lhs.eval();
            new_rhs = new_rhs.eval();
            return new Sentence([new_lhs, new Round(new_rhs)]);
        }
        hasTwo(){
            return this.lhs.hasTwo() || this.rhs.hasTwo();
        }
        lift(){
            return new Equation(this.lhs.lift(), this.rhs.lift());
        }
        toString(){
            return "" + this.lhs + "=" + this.rhs;
        }
    }
    class Sentence{
        constructor(terms){
            this.terms = terms;
        }
        eval(){
            return new Sentence(this.terms.map(x => x.eval()));
        }
        hasTwo(){
            return this.terms.some(x => x.hasTwo());
        }
        lift(){
            return new Sentence(this.terms.map(x => x.lift()));
        }
        toString(){
            return this.terms.map(x=>x.toString()).join('');
        }
    }

    class Round{
        constructor(inside){
            this.inside = inside;
        }
        eval(){
            return this.inside.eval().lift();
        }
        hasTwo(){
            return this.inside.hasTwo();
        }
        lift(){
            return new Round(this.inside.lift());
        }
        toString(){
            return "(" + this.inside + ")";
        }
    }

    class Yu{
        constructor(contents){
            this.contents = contents;
        }
        eval(){
            return this;
        }
        hasTwo(){
            return this.contents == 2;
        }
        lift(){
            return new Yu(Math.min(this.contents + 1, 2));
        }
        toString(){
            return ["7","牧","^^"][this.contents];
        }
    }

    class ParseError{
        constructor(msg){this.msg = msg;}
        eval(){return "ParseError!" + this.msg;}
    }

    return {
        expression: {
        // 初期値を入れる
        raw: '',
        eq: new Round(new Equation(new Yu(0), new Yu(0))),
        parse: function(str){
                var stack = [];
                var frontier = [];
                var code = str.replace(/ /g, '').replace(/7/g, '0').replace(/牧/g, '1').replace(/\^\^/g,'2');
                for(var c of code){
                    switch(c){
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
                            if(stack.length == 0)return ParseError("開いていない括弧を閉じようとしました");
                            var tmp = stack.pop();
                            var eq_pos = frontier.findIndex(x=>x=='=');
                            if(eq_pos == -1){
                                tmp.push(new Round(new Sentence(frontier)));
                            }
                            else{
                                if(eq_pos == 0 || eq_pos == frontier.length - 1)return new ParseError("文の端に=は置けません．");
                                var lhs = frontier.slice(0, eq_pos);
                                var rhs = frontier.slice(eq_pos+1);
                                tmp.push(new Round(new Equation(new Sentence(lhs), new Sentence(rhs))));
                            }
                            frontier = tmp;
                            break;
                        default:
                            return new ParseError("知らない文字:" + c);
                    }                    
                }                
                console.log(frontier);
                if(stack.length > 0)return new ParseError("括弧が閉じきっていません．");
                var eq_pos = frontier.findIndex(x=>x=='=');
                if(eq_pos == -1)return new Sentence(frontier);
                else{
                    if(eq_pos == 0 || eq_pos == frontier.length - 1)return new ParseError("文の端に=は置けません．");
                    console.log(lhs);
                    var lhs = frontier.slice(0, eq_pos);
                    var rhs = frontier.slice(eq_pos+1);
                    return new Equation(new Sentence(lhs), new Sentence(rhs));
                }
            }
        },
    } 
}
}
</script>