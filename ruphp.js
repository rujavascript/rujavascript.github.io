function copyClipboard(elem)
{
	elem.select();
	document.execCommand('copy');
	window.getSelection().removeAllRanges();
}
function isVarSymbol(c) 
{
    if (c=='_' || c=='$' ||
        c=='0' || c=='1' || c=='2' || c=='3' || c=='4' || 
        c=='5' || c=='6' || c=='7' || c=='8' || c=='9')
        return true
    return c.toLowerCase() != c.toUpperCase()
}
function translate(text, translateFunction)
{
    let translatedText = ''
    let textFragment = ''
    let expected = ''
    for (let i=0;i<text.length;i++)
    {
        if (expected!='')
            if (text[i]==expected)
            {
                textFragment+=text[i]
                translatedText+=textFragment
                textFragment = ''
                expected = ''
            }
            else
                textFragment+=text[i]
        else
            if (text[i]=="'" || text[i]=='"' || text[i]=="`")
            {
                translatedText+=translateFunction(textFragment)
                textFragment = ''
                expected = text[i]
                textFragment+=text[i]
            }
            else
                textFragment+=text[i]             
    }
    if (expected!='')
        translatedText+=textFragment
    else 
        translatedText+=translateFunction(textFragment)
    return translatedText
}
function translateToRus(engText)
{
    let ruText = engText
    for (let i=0;i<ruWords.length;i++)
    {
        let splittedArray = ruText.split(engWords[i])
        let splittedArrayLength = splittedArray.length
        let unitedText = ''
        for (let j=0;j<splittedArrayLength-1;j++)
        {
            let leftLength = splittedArray[j].length
            let rightLength = splittedArray[j+1].length
        
            if ((leftLength>0 && isVarSymbol(splittedArray[j][leftLength-1])) || 
                (rightLength>0 && isVarSymbol(splittedArray[j+1][0])))
                unitedText += splittedArray[j]+engWords[i]
            else 
                unitedText += splittedArray[j]+ruWords[i]
        }
        unitedText += splittedArray[splittedArrayLength-1]
        ruText = unitedText
    }
    return ruText
}
function translateToEng(ruText)
{
    let engText = ruText
    for (let i=0;i<ruWords.length;i++)
    {
        let splittedArray = engText.split(ruWords[i])
        let splittedArrayLength = splittedArray.length
        let unitedText = ''
        for (let j=0;j<splittedArrayLength-1;j++)
        {
            let leftLength = splittedArray[j].length
            let rightLength = splittedArray[j+1].length
        
            if ((leftLength>0 && isVarSymbol(splittedArray[j][leftLength-1])) || 
                (rightLength>0 && isVarSymbol(splittedArray[j+1][0])))
                unitedText += splittedArray[j]+ruWords[i]
            else 
                unitedText += splittedArray[j]+engWords[i]
        }
        unitedText += splittedArray[splittedArrayLength-1]
        engText = unitedText
    }
    return engText
}

let engWords = 
[
    '__halt_compiler','abstract','and','array','as','break','callable','case','catch','class','clone','const','continue','declare','default','die','do','echo','else','elseif','empty','enddeclare','endfor','endforeach','endif','endswitch','endwhile','eval','exit','extends','final','for','foreach','function','global','goto','if','implements','include','include_once','instanceof','insteadof','interface','isset','list','namespace','new','or','print','private','protected','public','require','require_once','return','static','switch','throw','trait','try','unset','use','var','while','xor'
]
let ruWords = 
[
    '__останов_компиляции','абстрактный','и','массив','как','выход','вызываемый','случай','ловить','класс','клон','константа','продолжить','объявить','стандартный','умереть','делать','эхо','иначе','иначеесли','пустой','конецобъявления','конецдля','конецдлявсех','конецесли','конецвыбора','конецпока','оценка','выйти','расширяет','финал','для','длявсех','функция','глобальный','к','если','реализует','включать','включать_разово','экземпляр','вместо','интерфейс','установлен','список','пространствоимён','новый','или','печать','личный','защищённый','публичный','требовать','требовать_разово','вернуть','статичный','выбор','выбросить','черта','попробовать','отключен','использовать','переменная','пока','исключающееили'
]
function initLoad()
{
	if (!pageLoaded)
	{
		inputEn = document.querySelector('.enToRu [name="input"]')
        outputRu = document.querySelector('.enToRu [name="output"]')
        copyRu = document.querySelector('.enToRu [name="copy"]')
        inputRu = document.querySelector('.ruToEn [name="input"]')
        outputEn = document.querySelector('.ruToEn [name="output"]')
        copyEn = document.querySelector('.ruToEn [name="copy"]')
        copyRu.onclick = () => {copyClipboard(outputRu)}
        copyEn.onclick = () => {copyClipboard(outputEn)}
        inputEn.oninput = () => {outputRu.value = translate(inputEn.value, translateToRus)}
        inputRu.oninput = () => {outputEn.value = translate(inputRu.value, translateToEng)}
        textareas = document.getElementsByTagName('textarea');
        count = textareas.length;
        for(let i=0;i<count;i++)
        {
            textareas[i].onkeydown = function(e)
            {
                if(e.keyCode==9 || e.which==9)
                {
                    e.preventDefault();
                    var s = this.selectionStart;
                    this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
                    this.selectionEnd = s+1; 
                }
            }
        }
	}
}
let inputEn 
let outputRu 
let copyRu
let inputRu 
let outputEn 
let copyEn
let textareas 
let count 
let pageLoaded = false;
document.addEventListener('DOMContentLoaded', function() {initLoad();}, false);
document.addEventListener('readystatechange', event => {if (event.target.readyState === "complete"){initLoad();}});

