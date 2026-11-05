const fs=require('fs'),vm=require('vm'),assert=require('assert');
const screen={innerHTML:'',scrollTop:0};
const ctx={document:{querySelectorAll:()=>[],getElementById:()=>screen}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('club-check.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
for(const v of ['home','map','shop','club','register','scan','level','tickets','stories','history']){run(`cfShow('${v}')`);assert(screen.innerHTML.length>30,v);}
run('cfReset();cfScan()');assert.equal(run('cf.balance'),1300);assert.equal(run('cf.levelPoints'),1600);
run('cfScan()');assert.equal(run('cf.balance'),1300);
run('cfBonus()');assert.equal(run('cf.balance'),1200);assert.equal(run('cf.levelPoints'),1600);assert.equal(run('cf.bonuses'),3);
run('for(let i=0;i<20;i++)cfBonus()');assert.equal(run('cf.bonuses'),10);assert.equal(run('cf.balance'),500);
run('cfReset();cfRedeem(4)');assert.equal(run('cf.balance'),0);assert.equal(run('cfLevel()'),3);
run('cfRedeem(4)');assert.equal(run('cf.balance'),0);
run('cfReset();cf.levelPoints=400;cfRedeem(2)');assert.equal(run('cf.balance'),1200);
console.log('10 pantallas, código único, saldo, niveles y límite de bonos verificados.');
