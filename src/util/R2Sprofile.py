import cProfile, pstats, io, sys

profile_path = '/source/R2S/profile/'


def profileit(func):
    def wrapper(*args, **kwargs):
        datafn = profile_path + func.__name__ + ".profile" # Name the data file sensibly
        prof = cProfile.Profile()
        retval = prof.runcall(func, *args, **kwargs)
        s = io.StringIO()
        sortby = 'cumulative'
        ps = pstats.Stats(prof, stream=s).sort_stats(sortby)
        ps.print_stats()
        with open(datafn, 'w') as perf_file:
            perf_file.write(s.getvalue())
        return retval

    return wrapper

