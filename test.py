def main():
    try:
        stmt10()
        stmt20()
        stmt30()
        # stmt40()
        # stmt50()
        # stmt55()
        # stmt60()
        # stmt100()
        # stmt110()
    except End:
        return
    except GosubReturn:
        print("'반환'은 '서브루틴'과 함께 사용되어야 합니다.")
        return


lines = {}


def stmt10():
    # print("start counting:")
    # global a
    # a = int(input())
    goto(10,20)
lines[10] = stmt10


def stmt20():
    # gosub(20,100)
    goto(20,30)
lines[20] = stmt20


def stmt30():
    # print("Square is", s)
    print("hello 30")
lines[30] = stmt30


def stmt40():
    end()
lines[40] = stmt40


# def stmt50():
#     if i <= 5:
#         goto(50, 30)
# lines[50] = stmt50


# def stmt55():
#     if i <= 10:
#         goto(55, 30)
# lines[55] = stmt55


# def stmt60():
#     print("Counting complete.")
# lines[60] = stmt60


def stmt100():
    global s
    s = a * a
lines[100] = stmt100


def stmt110():
    gosub_return()
lines[110] = stmt110


def goto(from_line, to_line):
    linenums = list(lines.keys())
    if from_line > to_line:
        linenums_goto_use = linenums[
            linenums.index(to_line) : linenums.index(from_line) + 1
        ]
        for linenum in linenums_goto_use:
            lines[linenum]()
    else:
        linenums_goto_use = linenums[linenums.index(to_line) :]
        for linenum in linenums_goto_use:
            lines[linenum]()
        raise End()

def gosub(from_line, to_line):
    try:
        goto(from_line, to_line)
    except:
        return

def gosub_return():
    raise GosubReturn()

def end():
    raise End()

class End(Exception):
    pass

class GosubReturn(Exception):
    pass


main()
